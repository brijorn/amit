import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import Command from '../../lib/structures/Command';
import { PartialBotContext } from '../../typings';
import BotApplication from '../../index';

export default class extends Command {
  constructor(ctx: BotApplication) {
    super(
      ctx,
      new SlashCommandBuilder()
        .setName('tictactoe')
        .setDescription('Play tictactoe against the bot or your friends')
        .addMentionableOption(option =>
          option.setName('player').setDescription('The person you want to play against, leave blank if not'))
    );
  }

  async execute(interaction: CommandInteraction) {

    const player = interaction.options.getMentionable('target');


  }
}
