'use strict';

const proxyquire = require('proxyquire').noCallThru();
const chai = require('chai');

const Product = require('../src/product-model').Product;

const expect = chai.expect;

describe('product-app.test', () => {
    
    it('should return empty in case of null event', async () => {
        const component = proxyquire('../src/product-app', {
            './elasticsearch-persistency': mockPersistency()
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
        const component = proxyquire('../src/product-app', {
            './elasticsearch-persistency': mockPersistency(),
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
        const component = proxyquire('../src/product-app', {
            './elasticsearch-persistency': mockPersistency(),
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
        const component = proxyquire('../src/product-app', {
            './elasticsearch-persistency': mockPersistency(),
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
        const component = proxyquire('../src/product-app', {
            './elasticsearch-persistency': mockPersistency(),
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
        const product = new Product({
            id: '1234-1234-1234-1234',
            description: 'fake product description',
            price: 9999.99
        });
        const component = proxyquire('../src/product-app', {
            './elasticsearch-persistency': mockPersistency()
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

            const mockES = component.es();
            const indexCalleds = mockES.indexCalleds();
            expect(indexCalleds[0].index).to.be.equal("product-index");
            expect(indexCalleds[0].id).to.be.equal(product.id);
            expect(indexCalleds[0].body.id).to.be.equal(product.id);
            expect(indexCalleds[0].body.description).to.be.equal(product.description);
            expect(indexCalleds[0].body.price).to.be.equal(product.price);
            expect(indexCalleds[0].body.timestamp).to.be.not.null;
        }
        catch (e) {
            return Promise.reject(e);
        }
    });
    
});

function mockPersistency(isError) {
    return {};
    return {
        ElasticSearchRepository: (() => {
            let _indexCalleds = [];
            class ElasticSearchRepository {
                constructor(host) {
                    console.log(host);
                }

                index(index, id, body) {
                    const obj = {
                        index: index,
                        id: id,
                        body: body
                    };
                    _indexCalleds.push(obj);
                    if (isError) {
                        return Promise.reject(obj);
                    }
                    return Promise.resolve(obj);
                }

                indexCalleds() {
                    return _indexCalleds;
                }
            }
            return ElasticSearchRepository;
        })()
    };
}
