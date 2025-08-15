import { Markup, Scenes } from 'telegraf'
import { login } from '../services/rocketChatApi.js'

export const loginWizard = new Scenes.WizardScene(
    'login-wizard',
    ctx => {
        ctx.reply('Привет! Введи домен Rocket Chat (например: https://rc.example.com)')
        ctx.wizard.state.data = {}
        return ctx.wizard.next()
    },
    ctx => {
        ctx.wizard.state.data.url = ctx.message.text.trim()
        ctx.reply('Теперь введи Username')
        return ctx.wizard.next()
    },
    ctx => {
        ctx.wizard.state.data.username = ctx.message.text.trim()
        ctx.reply('Теперь пароль')

        ctx.deleteMessage().catch(() => {})

        return ctx.wizard.next()
    },
    async ctx => {
        ctx.wizard.state.data.password = ctx.message.text.trim()

        ctx.deleteMessage().catch(() => {})
       
        const { url, username, password } = ctx.wizard.state.data

        try {
            const { name, userId, authToken } = await login(url, username, password)

            ctx.session.rocketChat = { url, userId, authToken }

            ctx.reply(`Авторизация успешна!\nИмя: ${name}\nUserId: ${userId}\nToken: ${authToken}`)
            ctx.reply(
                'Выберите действие',
                Markup.inlineKeyboard([
                    Markup.button.callback('Channels', 'get_channels')
                ]),
            )
        } catch (error) {
            ctx.reply(`Ошибка авторизации: ${error.message}`)
        }

        return ctx.scene.leave()
    }
)
