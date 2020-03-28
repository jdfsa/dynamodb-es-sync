'use strict';

const app = require('./product.app');
const chai = require('chai');
const expect = chai.expect;

describe('product.app.test', function () {
    it('verifies behavior on empty event body', async () => {
        const result = await app.handler(null, null);

        //expect(result).to.be.an('object');
        //expect(result.statusCode).to.equal(200);
        //expect(result.body).to.be.an('string');

        //let response = JSON.parse(result.body);

        //expect(response).to.be.an('object');
        //expect(response.message).to.be.equal("hello world");
        // expect(response.location).to.be.an("string");
    });
});
