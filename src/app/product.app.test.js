'use strict';

const proxyquire = require('proxyquire');
const chai = require('chai');

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
                Records: []
            }, null);
            expect(result).to.be.empty;
        }
        catch (e) {
            return Promise.reject(e);
        }
    });
});

function mockPersistency(err, success) {
    return {
        ElasticSearchRepository: class MockElasticSearchRepository {
            constructor(host) { }
            index(index, id, body) {
                if (err) {
                    return Promise.reject(err);
                }
                return Promise.resolve(success);
            }
        }
    };
}
