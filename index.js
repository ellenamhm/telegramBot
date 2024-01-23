require('dotenv').config();
const TelegramApi = require('node-telegram-bot-api');
const express = require('express')

const app = express()

app.get('/', function(request, response) {
    console.log('GET /')
    response.writeHead(200, {'Content-Type': 'text/html'})
    response.end('<html><body><p>This is home Page.</p></body></html>')
})

app.post('/trello-webhook-test1', (req, res) => {
    console.log('POST /trello-webhook-test1')
    console.log(req.body)
    res.json('ok');
});

app.listen(process.env.PORT || 3000); 


const sequelize = require('./db');
const UserModel = require('./models');

const webhookHandler = async () => {

}


const token = process.env.TELEGRAMID
const bot = new TelegramApi(token, {polling:true})

const buttonAdd = {
    reply_markup: JSON.stringify({
        inline_keyboard: [
            [{text: 'add user', callback_data: '/adduser'}],
        ]
    })
}

const start = async () =>{
    await sequelize.authenticate();
    await sequelize.sync();
    console.log('Connection has been established successfully.');

    bot.setMyCommands([
        {command: '/start', description: 'hello start'},
        {command: '/info', description: 'hello info'},
    ])

    bot.on('message', async msg =>{
        const text = msg.text;
        const chatId = msg.chat.id;
        const fromId = msg.from.id;
        const nameUser = `${msg.from.first_name} ${msg.from.last_name}`;

        let userDb = await UserModel.findOne({
            where: {
                fromId: String(fromId)
            }
        })
        
        const isNewUser = userDb === null;
        if (isNewUser) {
            userDb = await UserModel.create({fromId, nameUser});
        }

        switch (text) {
            case '/start':
                if (isNewUser) {
                    await bot.sendMessage(chatId, `Welcome ${msg.from.first_name }`, buttonAdd);
                } else {
                    await bot.sendMessage(chatId, `Welcome again ${msg.from.first_name}`, buttonAdd);
                }
                break;
            case '/info':
                await bot.sendMessage(chatId, `Info welcome ${nameUser}` );
                break;
            default: 
                await bot.sendMessage(chatId, "I don't understand");
                break;
        }
    })

    bot.on('callback_query', async msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;
        console.log(data);

        if (data === '/adduser') {
            return bot.sendMessage(chatId, '/info' )
        }
    })
    
}

start().catch((error) => console.error('Unable to connect to the database:', error))