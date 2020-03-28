'use strict';

const app = require('./app/product.app');

const event = require('./tests/events/trigger-event.json');
app.handler(event, null);
