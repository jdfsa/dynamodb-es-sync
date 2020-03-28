const es = require('elasticsearch');
const client = new es.Client({
    host: 'localhost:9200'
});

class ElasticSearchRepository {
    index(index, id, body) {
        return new Promise((resolve, reject) => {
            let obj = {
                index: index,
                id: id,
                body: body
            };
            console.debug('Enviando para o ElasticSearch:', obj);
            client.index(obj, (err, res) => {
                if (err) return reject(err);
                resolve(res);
            });
        });
    }
};

module.exports = new ElasticSearchRepository();