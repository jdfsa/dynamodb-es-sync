const es = require('elasticsearch');
const client = new es.Client({
    host: 'localhost:9200'
})

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
exports.lambdaHandler = async (event, context) => {
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
        
        const indexPromise = new Promise((resolve, reject) => {
            client.index({
                index: 'product-index',
                id: id,
                body: body
            }, (err, res) => {
                if (err) return reject(err);
                resolve(res);
            });
        });

        await indexPromise
            .then(res => console.log(res))
            .catch(err => console.log(err));
        
        // await client.indices.refresh({ index: 'product-index' });
    }
};

var event = require('../events/trigger-event.json');
exports.lambdaHandler(event, null);
