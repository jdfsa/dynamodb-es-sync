'use strict';

const chai = require('chai');
const nock = require('nock');
const uuid = require('uuid').v4;

const ElasticSearchRepository = require('./elasticsearch-persistency').ElasticSearchRepository;
const expect = chai.expect;

describe('elasticsearch-persistency.test', () => {

    let component = new ElasticSearchRepository();

    it('constructor with default host', async () => {
        expect(component.host()).to.equal('http://localhost:9200');
    });

    it('constructor with custom host', async () => {
        const componentWithAnotherHost = new ElasticSearchRepository('http://fake-host:9999');
        expect(componentWithAnotherHost.host()).to.equal('http://fake-host:9999');
    });

    it('should result OK', async () => {
        const id = uuid();
        const expectedResult = {
            'fake-body-item': 'fake-item-value'
        };
        nock(component.host())
            .post('/test-index/_doc/' + id)
            .reply(200, expectedResult);
        try {
            const result = await component.index('test-index', id, expectedResult);
            expect(result).to.be.eqls(expectedResult);
        }
        catch (e) {
            return Promise.reject(e);
        }
    });

    it('should result in error', async () => {
        const id = uuid();
        const expectedResult = {
            'fake-error-body-item': 'fake-error-item-value'
        };
        nock(component.host())
            .post('/test-index/_doc/' + id)
            .reply(400, expectedResult);
        try {
            await component.index('test-index', id, expectedResult);
        }
        catch (e) {
            expect(e).to.be.eqls(expectedResult);
        }
    });
});
