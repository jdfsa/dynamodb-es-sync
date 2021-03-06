'use strict';

const app = require('./product-app');

const event = require('../events/dynamodb-event.json');
app.handler(event, null)
    .then(res => {
        console.info(res);
    })
    .catch(err => {
        console.error(err);
    });
