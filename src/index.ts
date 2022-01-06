import { Client, ClientOptions, Collection } from 'discord.js';
import CommandHandler from './handlers/CommandHandler';
import EventHandler from './handlers/EventHandler';
import SongManager from './lib/music/SongManager';
import { BotContext, PartialBotContext } from './typings';

const dotenv = require('dotenv').config();

const opt: ClientOptions = {
  intents: ['GUILD_MEMBERS', 'GUILDS', 'GUILD_VOICE_STATES']
};

export default class BotApplication {
  
  bot: Client;
  commands: CommandHandler;

  events: EventHandler;

  music: Collection<string, SongManager>
  constructor() {
    this.bot = new Client(opt);
    this.commands = new CommandHandler(this);

    this.events = new EventHandler(this);
    this.music = new Collection()
  
    this.bot.login(process.env.DISCORD_TOKEN);

  }
}

new BotApplication()
