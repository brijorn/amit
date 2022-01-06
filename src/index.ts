import { Client, ClientOptions, Collection } from 'discord.js';
import CommandHandler from './handlers/CommandHandler';
import EventHandler from './handlers/EventHandler';
import { BotContext } from './typings';

const dotenv = require('dotenv').config()

const opt: ClientOptions = {
  intents: ['GUILD_MEMBERS', 'GUILDS']
};

const bot = new Client(opt);
const commands = new CommandHandler(bot);
const events = new EventHandler(bot);
const ctx: BotContext = {
  bot: bot,
  commands: commands,
  events: events,
  music: new Collection()
};

ctx.bot.login(process.env.DISCORD_TOKEN);
