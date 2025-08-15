import { configDotenv } from 'dotenv'
import { Telegraf, Scenes, session } from 'telegraf'
import { loginWizard } from './scenes/loginScene.js'

configDotenv()

const stage = new Scenes.Stage([loginWizard])
const bot = new Telegraf(process.env.BOT_TOKEN)

bot.use(session())
bot.use(stage.middleware())

bot.start(ctx => ctx.scene.enter('login-wizard'))

bot.launch()
console.log('Bot is running');

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'))
