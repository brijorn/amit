import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, Interaction } from "discord.js";
import OriginClient from "../../lib/OriginClient";
import Command from "../../lib/structures/Command";

export default class extends Command {
  constructor(bot: OriginClient) {
    super(
      bot,
      new SlashCommandBuilder()
    .setName("slap")
    .setDescription("Slap someone ig")
    .addMentionableOption(option =>
      option.setName("target").setDescription("The person you want to slap").setRequired(true)),
    )
  }

  async execute(interaction: CommandInteraction) {
    
    const target = interaction.options.getMentionable("target");
    await interaction.reply(`${interaction.user} has slapped ${target}`);
  }
}
