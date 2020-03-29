'use strict';

/**
 * Model de produto
 */
exports.Product = class Product {
    
    /**
     * Inicialização de produto
     * 
     * @param {String} id identificação do produto
     * @param {String} description descrição do produto
     * @param {Number} price preço do produto
     */
    constructor(id, description, price) {
        this.id = id;
        this.description = description;
        this.price = price;
    }

    /**
     * Converte o produto em um formato específico para persistência
     * 
     * @param {Object} template extensão ao modelo a ser retornado
     */
    toPersistencyFormat(template) {
        return Object.assign(template || {}, {
            'product_id': this.id,
            'description': this.description,
            'price': this.price
        });
    }

    /**
     * Inicializa um produto a partir de um objeto retornado pelo DynamoDB Stream
     * 
     * @param {Object} p dados do produto
     * @returns {Product} dados do produto
     */
    static fromDynamoDbFormat = (p) => new Product(
        p.id.S,
        p.description.S,
        p.price.N
    );
};