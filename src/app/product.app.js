'use strict';

const esRepository = require('./persistency/elasticsearch.persistency');
const Product = require('./product.model');

/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Context doc: https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html 
 * @param {Object} context
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 * 
 */
exports.handler = async (event, context) => {
    const records = event.Records;
    if (!records || records.length == 0) {
        console.info("Nenhum registro válido informado");
    }
    
    return Promise.all(records.map(record => {
        let product = Product.fromDynamo(record.dynamodb.NewImage);

        let body = product.toPersistency({
            'timestamp': Date.now()
        });
        
        return esRepository.index('product-index', product.id, body)
            .then(res => console.info(res))
            .catch(err => console.error(err));
    }));
};
