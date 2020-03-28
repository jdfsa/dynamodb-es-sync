'use strict';

const app = require('./app/app.js');

const event = require('./tests/events/trigger-event.json');
app.handler(event, null);
