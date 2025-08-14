import { configDotenv } from 'dotenv'
import express from 'express';
import bodyParser from 'body-parser'
import TelegramBot from 'node-telegram-bot-api'
import { Auth } from './Auth.js'

configDotenv()

const app = express()
app.use(bodyParser.json())

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true })

let chatId = null
const userStates = {}

bot.onText(/\/start/, (msg) => {
    chatId = msg.chat.id
    bot.sendMessage(chatId, 'Привет! Введи домен Rocket Chat')
    userStates[chatId] = { step: 'awaiting_url' }
})

bot.on('message', async (msg) => {
    chatId = msg.chat.id
    const state = userStates[chatId]

    if (!state) return

    if (state.step == 'awaiting_url') {
        state.url = msg.text.trim()
        state.step = 'awaiting_username'
        bot.sendMessage(chatId, 'Username')
    } 

    else if (state.step == 'awaiting_username') {
        state.username = msg.text.trim()
        state.step = 'awaiting_password'
        bot.sendMessage(chatId, 'Password')
    }

    else if (state.step == 'awaiting_password') {
        state.password = msg.text.trim()

        try {
            const auth = new Auth(state.url)
            const loginResponse = await auth.login(state.username, state.password)
            bot.sendMessage(chatId, loginResponse.join('\n'))
        } catch (error) {
            console.error(error);
        }

        delete userStates[chatId]
    }
})

const port = process.env.PORT
app.listen(port, () => {
    console.log(`Server is running on: http://localhost:${port}`)
})
