import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, Interaction } from "discord.js";
import Command from "../../lib/structures/Command";
import { BotContext } from "../../typings";

export default class extends Command {
  constructor(ctx: BotContext) {
    super(
      ctx,
      new SlashCommandBuilder()
    .setName("slap")
    .setDescription("Slap someone ig")
    .addMentionableOption(option =>
      option.setName("target").setDescription("The person you want to slap").setRequired(true)),
    )
  }

  async execute(interaction: Interaction) {
    if (interaction.isApplicationCommand)
    const target = interaction.options.getMentionable("target");
    await interaction.reply(`${interaction.user} has slapped ${target}`);
  }
}
