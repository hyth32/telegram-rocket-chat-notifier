import { Markup } from 'telegraf'
import { getJoinedChannels } from '../services/rocketChatApi.js'

export const getJoinedChannelsAction = async (ctx) => {
    const rc = ctx.session.rocketChat

    if (!rc) {
        return ctx.reply('Сначала авторизуйтесь командой /start')
    }

    try {
        const channels = await getJoinedChannels(rc.url, rc.authToken, rc.userId)
        console.log(channels)
        
        if (channels.length == 0) {
            return ctx.reply('Нет доступных каналов')
        }

        const buttons = channels.map(channel => [Markup.button.callback(channel.name, `channel_${channel.id}`)])

        await ctx.reply(
            'Список каналов',
            Markup.inlineKeyboard(buttons),
        )
    } catch (error) {
        ctx.reply(`Ошибка получения списка каналов: ${error.message}`)
    }
}
