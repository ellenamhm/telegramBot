const TelegramApi = require('node-telegram-bot-api');
require('dotenv').config();

var http = require('http'); // 1 - Import Node.js core module

const server = http.createServer(function (req, res) {   // 2 - creating server
    res.writeHead(200, { 'Content-Type': 'text/html' }); 
        
    // set response content    
    res.write('<html><body><p>This is home Page.</p></body></html>');
    res.end();
    //handle incomming requests here..

});

server.listen(process.env.PORT || 3000); 


const sequelize = require('./db');
const UserModel = require('./models');


const token = process.env.TELEGRAMID
const bot = new TelegramApi(token, {polling:true})

const buttonAdd = {
    reply_markup: JSON.stringify({
        inline_keyboard: [
            [{text: 'add user', callback_data: '/adduser'}],
        ]
    })
}


const  start = async () =>{

    try {
        await sequelize.authenticate();
        await sequelize.sync();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }


    bot.setMyCommands([
        {command: '/start', description: 'hello start'},
        {command: '/info', description: 'hello info'},
    ])
    bot.on('message', async msg =>{
        const text = msg.text;
        const chatId = msg.chat.id;
        await UserModel.create({chatId})
        if(text == '/start'){
            return bot.sendMessage(chatId, "welcome " + msg.from.first_name , buttonAdd)
        }
        if(text == '/info'){
            const user = await UserModel.findOne({chatId})
            await bot.sendMessage(chatId, `welcome ${msg.from.first_name}` )
        }
        return bot.sendMessage(chatId, 'i not inderstend')
    })

    bot.on('callback_query', async msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;
        console.log(data);

        if (data === '/adduser') {
            return bot.sendMessage(chatId, data )
        }
    
        // await user.save();
    })
    
}
start()