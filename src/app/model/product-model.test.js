'use strict';

const Product = require('./product-model').Product;

const chai = require('chai');
const expect = chai.expect;

describe('product-model.test', () => {
    
    it('verifies class constructor', async () => {
        const expected = {
            id: 'id-test',
            description: 'description test',
            price: 9999.99
        };
        const actual = new Product(expected.id, expected.description, expected.price);
        expect(actual).to.be.eqls(expected);
    });
    
    it('verifies fromDynamoDb construction', async () => {
        const expected = {
            id: 'id-test',
            description: 'description test',
            price: 9999.99
        };
        const actual = Product.fromDynamoDbFormat({
            "id": {
                "S": expected.id
            },
            "description": {
                "S": expected.description
            },
            "price": {
                "N": expected.price
            }
        });
        expect(actual).to.be.eqls(expected);
    });

    it('verifies toPersistency model', async () => {
        const expected = {
            'product_id': 'id-test',
            'description': 'description test',
            'price': 9999.99
        };
        const product = new Product(expected.product_id, expected.description, expected.price);
        expect(product.toPersistencyFormat()).to.be.eqls(expected);
    });

    it('verifies toPersistency model with extendend properties', async () => {
        const expected = {
            'product_id': 'id-test',
            'description': 'description test',
            'price': 9999.99
        };
        const extension = {
            'extended-property-1': 'property value',
            'extended-property-2': Date.now(),
            'extended-property-3': 12345
        };
        const product = new Product(expected.product_id, expected.description, expected.price);
        expect(product.toPersistencyFormat(extension)).to.be.eqls(
            Object.assign(extension, expected)
        );
    });
});
