import { ButtonInteraction, CommandInteraction, MessageEmbed } from "discord.js";


export function commandError(interaction: CommandInteraction | ButtonInteraction, description: string) {
    interaction.reply({
        embeds: [new MessageEmbed().setDescription(description).setColor("RED")],
        ephemeral: true,
      });
}

export function commandSuccess(interaction: CommandInteraction | ButtonInteraction, description: string) {
    return interaction.reply({
        embeds: [
          new MessageEmbed().setDescription(description).setColor("#80623e"),
        ],
      });
}

export function commandSuccessFollowUp(interaction: CommandInteraction | ButtonInteraction, description: string) {
  return interaction.followUp({
      embeds: [
        new MessageEmbed().setDescription(description).setColor("#80623e"),
      ],
    });
}
