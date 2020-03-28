'use strict';

const proxyquire = require('proxyquire');
const chai = require('chai');
const path = require('path');

const expect = chai.expect;

describe('elasticsearch.persistency.test', () => {

    let componentPath = null;

    before(() => {
        componentPath = path.join(process.cwd(), '/src/app/persistency', 'elasticsearch.persistency');
    });

    it('verifies behavior on empty event body', async () => {
        const expectedResult = {
            'fake-body-item': 'fake-item-value'
        };
        const ElasticSearchRepository = proxyquire.noCallThru()
            .load('./elasticsearch.persistency', {
                'elasticsearch': mockEs(undefined, expectedResult),
            });
        const component = new ElasticSearchRepository('http://fake-endpoint');
        try {
            const result = await component.index('test-index', 'fake-id', expectedResult);
            expect(result).to.be.eqls(expectedResult);
        }
        catch (e) {
            return Promise.reject(e);
        }
    });
});

function mockEs(errResult, sucessResult) {
    return {
        Client: class ClientMock {
            constructor(obj) {
                this.name = 'fake-client';
            }
            index(obj, callback) {
                callback(errResult, sucessResult);
            }
        }
    };
}