const TelegramApi = require('node-telegram-bot-api');

const token = '6880047259:AAF9v-A2O42qZMuJ9gN9pAQNp_KfZFX9ejs'
const bot = new TelegramApi(token, {polling:true})
const start = () =>{
    bot.setMyCommands([
        {command: '/start', description: 'hello start'},
        {command: '/info', description: 'hello info'},
    ])
    bot.on('message', async msg =>{
        const text = msg.text;
        const chatId = msg.chat.id;
        if(text == '/start'){
            await bot.sendMessage(chatId, 'hello i am bot')
        }
        if(text == '/info'){
            await bot.sendMessage(chatId, 'welcome')
        }
    })
}
start()