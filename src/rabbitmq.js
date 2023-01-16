const amqp = require('crabbitmq');
const messages = require('./messages');

amqp.connect("amqp://guest:guest@127.0.0.1:5672?heartbeat=10");

messages();
