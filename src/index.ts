import { Client, ClientOptions, Collection } from 'discord.js';
import CommandHandler from './handlers/CommandHandler';
import EventHandler from './handlers/EventHandler';
import SongManager from './lib/music/SongManager';
import { BotContext } from './typings';

const dotenv = require('dotenv').config();

const opt: ClientOptions = {
  intents: ['GUILD_MEMBERS', 'GUILDS']
};

class BotApplication {
  bot: Client;
  commands: CommandHandler;

  events: EventHandler;
  constructor() {
    this.bot = new Client(opt);
    this.commands = new CommandHandler(this.getContext());
    this.events = new EventHandler(this.getContext());

    this.bot.login(process.env.DISCORD_TOKEN);
  }

  getContext(): BotContext {
    return {
      bot: this.bot,
      commands: this.commands,
      events: this.events,
      music: new Collection<string, SongManager>()
    };
  }
}

new BotApplication()