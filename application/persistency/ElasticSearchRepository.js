const es = require('elasticsearch');
const client = new es.Client({
    host: 'localhost:9200'
});

const ElasticSearchRepository = class ElasticSearchRepository {
    index(index, id, body) {
        return new Promise((resolve, reject) => {
            client.index({
                index: index,
                id: id,
                body: body
            }, (err, res) => {
                if (err) return reject(err);
                resolve(res);
            });
        });
    }
};

module.exports = new ElasticSearchRepository();