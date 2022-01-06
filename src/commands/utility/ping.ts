import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import Command from "../../lib/structures/Command";
import BotApplication from '../../index';
export default class extends Command {
  constructor(ctx: BotApplication) {
    super(
      ctx,
      new SlashCommandBuilder()
        .setName("ping")
        .setDescription("See the response time of the bot")
    );
  }
  async execute(interaction: CommandInteraction) {
    const sent = interaction.createdAt;

    const time = new Date().getMilliseconds() - sent.getMilliseconds();

    await interaction.reply(`Pong response took ${time}ms`);
  }
}
