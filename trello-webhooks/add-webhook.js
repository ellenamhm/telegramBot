require('dotenv').config();
var Trello = require("trello");
var fs = require('fs');

var trello = new Trello(process.env.TRELLOAPI, process.env.TRELLOTOKEN);
//console.log(process.env.TRELLO_ID_LIST1);

// https://telegram-bot-recruit.adaptable.app
//https://telegrambotrecruit.adaptable.app
//https://bb57-188-163-27-72.ngrok-free.app
const host = 'https://d435-188-163-27-72.ngrok-free.app'
// 65ad19cf994e2979182d85e1

trello.addWebhook('webhook 1', `${host}/trello-webhook-test1`, process.env.TRELLO_ID_LIST1, (e, res) => {
    if (e) {
        console.log('error', e.response.statusMessage)
    } else {
        console.log('added successfully')
    }
})