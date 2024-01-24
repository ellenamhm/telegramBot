require('dotenv').config();
const { telegramBot } = require('./telegram')
const express = require('express')
const bodyParser = require('body-parser')

const sequelize = require('./db');
const UserModel = require('./models');

const app = express()

app.use(bodyParser.json())

app.get('/', function(request, response) {
    console.log('GET /')
    response.writeHead(200, {'Content-Type': 'text/html'})
    response.end('<html><body><p>This is home Page.</p></body></html>')
})

app.post('/trello-webhook-test1', (req, res) => {
    console.log('POST /trello-webhook-test1')
    // console.log(req.body)
    webhookHandler().catch((error) => console.error('handler catcher', error))
    res.json({ status: 'ok' });
});

app.head("/trello-webhook-test1", function (req, res) {
    console.log('HEAD /trello-webhook-test1')
    res.json({ status: 'ok' })
}) 

app.listen(process.env.PORT || 3000); 


const webhookHandler = async () => {
    const users = await UserModel.findAll({})
    for (const user of users) {
        console.log('New changes in trello', user.id, user.chatId, user.nameUser);
        await telegramBot.sendMessage(user.chatId, 'New changes in trello')
    }
}


const buttonAdd = {
    reply_markup: JSON.stringify({
        inline_keyboard: [
            [{text: 'info about user', callback_data: '/aboutuser'}],
        ]
    })
}
const buttonStart = {
    reply_markup: JSON.stringify({
        inline_keyboard: [
            [{text: 'Starting', callback_data: '/start@recruterHelenaBot'}],
        ]
    })
}
const start = async () =>{
    await sequelize.authenticate();
    // await sequelize.sync();
    await sequelize.sync({ force: true });
    console.log('Connection has been established successfully.');

    telegramBot.setMyCommands([
        {command: '/start', description: 'hello start'},
        {command: '/info', description: 'hello info'},
    ])

   

    telegramBot.on('message', async msg =>{
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
            userDb = await UserModel.create({fromId, chatId, nameUser});
        } else {
            userDb.chatId = chatId;
            await userDb.save()
        }

        switch (text) {
            case '/start':
                if (isNewUser) {
                    await telegramBot.sendMessage(chatId, `Welcome ${msg.from.first_name }`, buttonAdd);
                } else {
                    await telegramBot.sendMessage(chatId, `Welcome again ${msg.from.first_name}`, buttonAdd);
                }
                break;
            case '/start@recruterHelenaBot':
                await telegramBot.sendMessage(chatId, `I am here ${nameUser}` , buttonAdd );
                break;
            case '/info':
                await telegramBot.sendMessage(chatId, `Info about  ${nameUser}` );
                break;
            default: 
                await telegramBot.sendMessage(chatId, `i am simple bot press BTN` , buttonStart);
                break;
        }
    })

    telegramBot.on('callback_query', async msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;
      
        if (data === '/aboutuser') {
            return telegramBot.sendMessage(chatId, '/info' )
        }

        if (data === '/start@recruterHelenaBot') {
            return telegramBot.sendMessage(chatId, 'bot started'  ,  '/start@recruterHelenaBot')
        }
    })
    
}

start().catch((error) => console.error('Unable to connect to the database:', error))