const util = require('util');
const es = require('elasticsearch');

/**
 * Classe para conexão com o ElasticSearch
 */
exports.ElasticSearchRepository = (() => {
    let _client = null;
    let _host = null;
    
    class ElasticSearchRepository {

        /**
         * Construtor principal
         * @param {String} host - endpoint para conexão com o ElasticSearch
         */
        constructor(host) {
            _host = host || 'http://localhost:9200';
            _client = new es.Client({
                'host': _host
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
                _client.index(obj, (err, res) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve(res);
                });
            });
        }

        /**
         * Retorna o host
         */
        host() {
            return _host;
        }
    }

    return ElasticSearchRepository
})();
