import { SlashCommandBuilder } from '@discordjs/builders';
import {
  CommandInteraction
} from 'discord.js';
import Command from '../../lib/structures/Command';
import { PartialBotContext } from '../../typings';
import BotApplication from '../../index';

export default class extends Command {
  constructor(ctx: BotApplication) {
    super(
      ctx,
      new SlashCommandBuilder()
        .setName('slap')
        .setDescription('Slap someone ig')
        .addMentionableOption((option) =>
          option
            .setName('target')
            .setDescription('The person you want to slap')
            .setRequired(true)
        )
    );
  }

  async execute(interaction: CommandInteraction) {
    const target = interaction.options.getMentionable('target');
    await interaction.reply(`${interaction.user} has slapped ${target}`);
  }
}
