'use strict';

const proxyquire = require('proxyquire');
const chai = require('chai');

const expect = chai.expect;

describe('elasticsearch-persistency.test', () => {

    it('constructor with default host', async () => {
        const ElasticSearchRepository = proxyquire.noCallThru()
            .load('./elasticsearch-persistency', {
                'elasticsearch': mockEs(),
            }).ElasticSearchRepository;
        const component = new ElasticSearchRepository();
        expect(component.client().params).to.be.eqls({
            host: 'localhost:9200'
        });
    });

    it('constructor with custom host', async () => {
        const ElasticSearchRepository = proxyquire.noCallThru()
            .load('./elasticsearch-persistency', {
                'elasticsearch': mockEs(),
            }).ElasticSearchRepository;
        const component = new ElasticSearchRepository('fake-host:9999');
        expect(component.client().params).to.be.eqls({
            host: 'fake-host:9999'
        });
    });

    it('index() result OK', async () => {
        const expectedResult = {
            'fake-body-item': 'fake-item-value'
        };
        const ElasticSearchRepository = proxyquire.noCallThru()
            .load('./elasticsearch-persistency', {
                'elasticsearch': mockEs(undefined, expectedResult),
            }).ElasticSearchRepository;
        const component = new ElasticSearchRepository();
        try {
            const result = await component.index('test-index', 'fake-id', expectedResult);
            expect(result).to.be.eqls(expectedResult);
        }
        catch (e) {
            return Promise.reject(e);
        }
    });

    it('index() result error', async () => {
        const expectedResult = {
            'fake-body-item': 'fake-item-value'
        };
        const ElasticSearchRepository = proxyquire.noCallThru()
            .load('./elasticsearch-persistency', {
                'elasticsearch': mockEs(expectedResult),
            }).ElasticSearchRepository;
        const component = new ElasticSearchRepository();
        try {
            await component.index('test-index', 'fake-id', expectedResult);
        }
        catch (e) {
            expect(e).to.be.eqls(expectedResult)
        }
    });
});

function mockEs(err, success) {
    return {
        Client: class ClientMock {
            constructor(params) {
                this.params = params;
            }
            index(obj, callback) {
                callback(err, success);
            }
        }
    };
}