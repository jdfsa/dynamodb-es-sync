const repository = require('./persistency/ElasticSearchRepository');

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
    for (let i = 0; i < records.length; i++) {
        let p = records[i].dynamodb.NewImage;
        
        let id = p.id.S;
        let body = {
            'product_id': id,
            'description': p.description.S,
            'price': p.price.N,
            'timestamp': Date.now
        };
        
        await repository.index('product-index', id, body)
            .then(res => console.log(res))
            .catch(err => console.log(err));
        
        await repository.get('product-index', id)
            .then(res => console.log(res))
            .catch(err => console.log(err));

        await repository.search('product-index', {
            'query': {
                'match_all': {}
            }
        }).then(res => {
            console.log(res);
        }).catch(err => console.log(err));
    }
};

var event = require('../events/trigger-event.json');
exports.handler(event, null);
