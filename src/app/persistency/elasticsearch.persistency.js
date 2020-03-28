const util = require('util');
const es = require('elasticsearch');

/**
 * Classe para conexão com o ElasticSearch
 */
module.exports = class ElasticSearchRepository {
    #client;

    /**
     * Construtor principal
     * @param {String} host - endpoint para conexão com o ElasticSearch
     */
    constructor(host) {
        if (!this.#client) {
            host = host || 'localhost:9200';
            this.#client = new es.Client({
                host: 'localhost:9200'
            });
        }
    }

    /**
     * Cataloga um índice no ElasticSearch
     * 
     * @param {String} index 
     * @param {String|Number} id 
     * @param {Object} body 
     */
    index(index, id, body) {
        return new Promise((resolve, reject) => {
            let obj = {
                index: index,
                id: id,
                body: body
            };
            console.debug('Enviando para o ElasticSearch:', util.inspect(obj));
            this.#client.index(obj, (err, res) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(res);
            });
        });
    }
};
