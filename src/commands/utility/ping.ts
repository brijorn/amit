import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import OriginClient from "../../lib/OriginClient";
import Command from "../../lib/structures/Command";
export default class extends Command {
  constructor(bot: OriginClient) {
    super(
      bot,
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
