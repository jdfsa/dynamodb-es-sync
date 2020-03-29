'use strict';

const proxyquire = require('proxyquire');
const chai = require('chai');

const Product = require('./model/product.model').Product;

const expect = chai.expect;

describe('product.app.test', function () {
    
    it('should return empty in case of null event', async () => {
        const component = proxyquire.noCallThru()
            .load('./product.app', {
                './persistency/elasticsearch.persistency': mockPersistency(undefined, {
                    'fake-result-item': 'fake-item-value'
                }),
            });
        try {
            const result = await component.handler(null, null);
            expect(result).to.be.empty;
        }
        catch (e) {
            return Promise.reject(e);
        }
    });

    it('should return empty in case of no Records', async () => {
        const component = proxyquire.noCallThru()
            .load('./product.app', {
                './persistency/elasticsearch.persistency': mockPersistency(undefined, {
                    'fake-result-item': 'fake-item-value'
                }),
            });
        try {
            const result = await component.handler({}, null);
            expect(result).to.be.empty;
        }
        catch (e) {
            return Promise.reject(e);
        }
    });

    it('should return empty in case of empty Records', async () => {
        const component = proxyquire.noCallThru()
            .load('./product.app', {
                './persistency/elasticsearch.persistency': mockPersistency(undefined, {
                    'fake-result-item': 'fake-item-value'
                }),
            });
        try {
            const result = await component.handler({
                "Records": []
            }, null);
            expect(result).to.be.empty;
        }
        catch (e) {
            return Promise.reject(e);
        }
    });

    it('should ignore in case of no dynamo record', async () => {
        const component = proxyquire.noCallThru()
            .load('./product.app', {
                './persistency/elasticsearch.persistency': mockPersistency(undefined, {
                    'fake-result-item': 'fake-item-value'
                }),
            });
        try {
            const result = await component.handler({
                "Records": [{
                    "invalidRecord": {}
                }]
            }, null);
            expect(result).to.be.eqls([{}]);
        }
        catch (e) {
            return Promise.reject(e);
        }
    });

    it('should ignore in case of no NewImage in dynamo record', async () => {
        const component = proxyquire.noCallThru()
            .load('./product.app', {
                './persistency/elasticsearch.persistency': mockPersistency(undefined, {
                    'fake-result-item': 'fake-item-value'
                }),
            });
        try {
            const result = await component.handler({
                "Records": [{
                    "dynamodb": {
                        "OldImage": {
                            "id": {
                                "S": "1234-1234-1234-1234"
                            },
                            "description": {
                                "S": "New test product with the name and price changed"
                            },
                            "price": {
                                "N": 5000.0
                            }
                        }
                    }
                }]
            }, null);
            expect(result).to.be.eqls([{}]);
        }
        catch (e) {
            return Promise.reject(e);
        }
    });

    it('should process in case of NewImage in dynamo record', async () => {
        const product = new Product("1234-1234-1234-1234", 'fake product description', 9999.99)
        const expectedResult = [{
            'fake-result-item': 'fake-item-value'
        }];
        const persistency = mockPersistency(undefined, expectedResult);
        const component = proxyquire.noCallThru()
            .load('./product.app', {
                './persistency/elasticsearch.persistency': persistency,
            });
        try {
            const result = await component.handler({
                "Records": [{
                    "dynamodb": {
                        "NewImage": {
                            "id": {
                                "S": product.id
                            },
                            "description": {
                                "S": product.description
                            },
                            "price": {
                                "N": product.price
                            }
                        }
                    }
                }]
            }, null);
            expect(result).to.be.eqls([
                expectedResult
            ]);
            const mockES = component.es();
            expect(mockES.indexCalleds[0].index).to.be.equal("product-index");
            expect(mockES.indexCalleds[0].id).to.be.equal(product.id);
            expect(mockES.indexCalleds[0].body.product_id).to.be.equal(product.id);
            expect(mockES.indexCalleds[0].body.description).to.be.equal(product.description);
            expect(mockES.indexCalleds[0].body.price).to.be.equal(product.price);
            expect(mockES.indexCalleds[0].body.timestamp).to.be.not.null;
        }
        catch (e) {
            return Promise.reject(e);
        }
    });
    
});

function mockPersistency(err, success) {
    return {
        ElasticSearchRepository: class MockElasticSearchRepository {
            indexCalleds = [];
            constructor(host) { }
            index(index, id, body) {
                this.indexCalleds.push({
                    index: index,
                    id: id,
                    body: body
                });
                if (err) {
                    return Promise.reject(err);
                }
                return Promise.resolve(success);
            }
        }
    };
}
