const TelegramApi = require('node-telegram-bot-api');

const token = '6880047259:AAF9v-A2O42qZMuJ9gN9pAQNp_KfZFX9ejs'
const bot = new TelegramApi(token, {polling:true})
const buttonAdd = {
    reply_markup: JSON.stringify({
        inline_keyboard: [
            [{text: 'add user', callback_data: '/adduser'}],
        ]
    })
}


const start = () =>{
    bot.setMyCommands([
        {command: '/start', description: 'hello start'},
        {command: '/info', description: 'hello info'},
    ])
    bot.on('message', async msg =>{
        const text = msg.text;
        const chatId = msg.chat.id;
        if(text == '/start'){
            return bot.sendMessage(chatId, "welcome " + msg.from.first_name , buttonAdd)
        }
        if(text == '/info'){
            await bot.sendMessage(chatId, 'welcome')
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
        // const user = await UserModel.findOne({chatId})
  
        // await user.save();
    })
}
start()