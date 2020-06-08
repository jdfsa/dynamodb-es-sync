'use strict';

const aws = require('aws-sdk');

/**
 * Model de produto
 */
exports.Product = class Product {
    
    /**
     * Inicialização de produto
     */
    constructor(obj) {
        Object.assign(this, obj || {}, this);
    }

    /**
     * Converte o produto em um formato específico para persistência
     * 
     * @param {Object} template extensão ao modelo a ser retornado
     */
    toPersistencyFormat(template) {
        return Object.assign(template || {}, this);
    }

    /**
     * Inicializa um produto a partir de um objeto retornado pelo DynamoDB Stream
     * 
     * @param {Object} p dados do produto
     * @returns {Product} dados do produto
     */
    static fromDynamoDbFormat = (p) => {
        const obj = aws.DynamoDB.Converter.unmarshall(p);
        return new Product(obj);
    };
};