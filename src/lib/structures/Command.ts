import { SlashCommandBuilder } from '@discordjs/builders';
import { Interaction } from 'discord.js';
import { BotContext, PartialBotContext } from '../../typings';
import BotApplication from '../../index';

export default class Command {
  data: SlashCommandBuilder;
  ctx: BotApplication;

  constructor(ctx: BotApplication, data: any) {
    this.data = data;
    this.ctx = ctx;
  }

  execute(interaction: Interaction): Promise<unknown> | undefined {
    throw new Error('Idiot It doesnt work');
  }
}
