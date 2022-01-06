import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import auth from '../config.json';
import CommandHandler from '../handlers/CommandHandler';

async function register() {
  const env = require('dotenv').config();
  const rest = new REST({ version: '9' }).setToken(process.env.DISCORD_TOKEN!);
  const bot: any = {};

  const commands = await new CommandHandler(bot).init();

  const restCmds = commands.map((cmd) => {
    return cmd.data.toJSON();
  });

  console.log(commands);
  console.log(restCmds);
  const send = await rest.put(Routes.applicationCommands(auth.clientId), {
    body: restCmds
  });
  console.log(send);
}


register()