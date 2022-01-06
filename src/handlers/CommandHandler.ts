import { Client, Collection } from 'discord.js';
import { readdirSync } from 'fs';
import { join } from 'path';
import auth from '../config.json';
import Command from '../lib/structures/Command';
import { BotContext } from '../typings';
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
export default class CommandHandler extends Collection<string, Command> {
  private bot: Client;
  constructor(bot: Client) {
    super();
    this.bot = bot;

    this.init().catch((err) => Promise.reject(new Error(err)));
  }

  async init(): Promise<CommandHandler> {
    const start = Date.now();

    const commands = await this.getCommands();

    commands.map((cmd) => {
      this.set(cmd.data.name, cmd);
    });

    return this;
  }

  async getCommands(json = false): Promise<Command[]> {
    const path = join(__dirname, '..', 'commands');

    const commands: Command[] = [];
    const modules = readdirSync(path);

    for (const module of modules) {
      // Loop through Commands in module
      let moduleCommands = readdirSync(`${path}/${module}`);
      moduleCommands.map((cmdFile) => {
        const cmdClass = ((r) => r.default || r)(
          require(`${path}/${module}/${cmdFile}`)
        );
        const cmd = new cmdClass(this.bot) as Command;
        commands.push(cmd);
      });
    }

    return commands;
  }
  fetch(name: string): Command | null {
    name = name.toLowerCase();
    if (this.has(name)) return this.get(name) as Command;
    else return null;
  }
}
