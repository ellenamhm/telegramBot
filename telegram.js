const TelegramApi = require('node-telegram-bot-api');
const token = process.env.TELEGRAMID

const bot = new TelegramApi(token, {polling:true})


module.exports = { telegramBot: bot };
