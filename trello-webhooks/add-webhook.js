require('dotenv').config();
var Trello = require("trello");

var trello = new Trello(process.env.TRELLOAPI, process.env.TRELLOTOKEN);

trello.addWebhook('webhook 1', 'https://telegram-bot-recruit.adaptable.app/trello-webhook-test1', process.env.TRELLO_ID_LIST1)
    .then(() => console.log('added successfully'))
    .catch((error) => console.error(error))