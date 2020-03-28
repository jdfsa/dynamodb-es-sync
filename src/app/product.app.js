'use strict';

const util = require('util');
const es = require('./persistency/elasticsearch.persistency');
const Product = require('./product.model');

// configura o inspect do 'util' para logar todos os níveis de um objeto
util.inspect.defaultOptions.depth = null;

/**
 * Handler para processamento de eventos gerados pelo DyamoDB
 * 
 * Event doc: https://docs.aws.amazon.com/lambda/latest/dg/with-ddb-example.html
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Context doc: https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html 
 * @param {Object} context
 *
 * Return doc: https://docs.aws.amazon.com/lambda/latest/dg/nodejs-handler.html
 * @returns {Promise} object - API Gateway Lambda Proxy Output Format
 * 
 */
exports.handler = async (event, context) => {
    return process(event, context)
        .then(res => {
            console.info('Evento processado com sucesso:', util.inspect(res));
            return Promise.resolve(res);
        })
        .catch(err => {
            console.error(util.inspect(err));
            return Promise.reject(err);
        });
};

/**
 * Processa um evento gerado a partir do DynamoDB
 * @param {Object} event - dados do evento
 * @param {Object} context - contexto lambda
 * @returns {Promise} object - API Gateway Lambda Proxy Output Format
 */
async function process(event, context) {
    console.debug('Recebido evento para processar:', util.inspect(event));

    if (!event) {
        console.warn('Recebido um evento inválido e será ignorado');
        return Promise.resolve({});
    }

    const records = event.Records;
    if (!records || records.length == 0) {
        console.warn('Nenhum registro informado para processar', records);
        return Promise.resolve({});
    }
    
    return Promise.all(records.map(record => {
        if (!record.dynamodb || !record.dynamodb.NewImage) {
            console.warn('Evento recebido não é um evento DynamoDB esperado');
            return Promise.resolve({});
        }

        let product = Product.fromDynamo(record.dynamodb.NewImage);
        console.debug('Produto a ser persistido:', util.inspect(product));

        let body = product.toPersistency({
            'timestamp': Date.now()
        });
        
        return es.index('product-index', product.id, body);
    }));
}