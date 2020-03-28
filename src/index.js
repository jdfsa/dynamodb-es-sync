'use strict';

const app = require('./app/product.app');

const event = require('./tests/events/dynamodb-event.json');
app.handler(event, null)
    .then(res => {
        console.info(res);
    })
    .catch(err => {
        console.error(err)
    });
