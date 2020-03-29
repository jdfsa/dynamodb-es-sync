const util = require('util');
const es = require('elasticsearch');

/**
 * Classe para conexão com o ElasticSearch
 */
exports.ElasticSearchRepository = class ElasticSearchRepository {
    #client;

    /**
     * Construtor principal
     * @param {String} host - endpoint para conexão com o ElasticSearch
     */
    constructor(host) {
        this.#client = new es.Client({
            'host': host || 'localhost:9200'
        });
    }

    /**
     * Insere ou atualiza um item no ElasticSearch
     * 
     * @param {String} index índice para catalogação
     * @param {String|Number} id do item a ser catalogado
     * @param {Object} body conteúdo do item a ser catalogado
     * @returns {Promise} com o conteúdo de retorno
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

    /**
     * Retorna o client criado localmente
     */
    client() {
        return this.#client;
    }
};
