require('dotenv').config();
var Trello = require("trello");

var trello = new Trello(process.env.TRELLOAPI, process.env.TRELLOTOKEN);

// trello.deleteWebhook()
//     .then(() => console.log('added successfully'))
//     .catch((error) => console.error(error))