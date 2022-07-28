import { Telegraf } from 'telegraf'

import { TELEGRAM_BOT_TOKEN } from './constants'

const telegramBot = new Telegraf(TELEGRAM_BOT_TOKEN)
telegramBot.start((ctx) => ctx.reply('Welcome'))
telegramBot.help((ctx) => ctx.reply('Send me a sticker'))
telegramBot.on('sticker', (ctx) => ctx.reply('👍'))
telegramBot.hears('hi', (ctx) => ctx.reply('Hey there'))
telegramBot.launch()

// Enable graceful stop
process.once('SIGINT', () => telegramBot.stop('SIGINT'))
process.once('SIGTERM', () => telegramBot.stop('SIGTERM'))
