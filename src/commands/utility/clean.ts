import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, Permissions } from "discord.js";
import Command from "../../lib/structures/Command";
import BotApplication from '../../index';
export default class extends Command {
  constructor(ctx: BotApplication) {
    super(
      ctx,
      new SlashCommandBuilder()
        .setName("clean")
        .setDescription("Delete the messages sent by the bot")
    );
  }
  async execute(interaction: CommandInteraction) {



    const perms = interaction.memberPermissions

    if (!perms) return interaction.reply({ content: "Error checking your permissions, try again later", ephemeral: true })

    if (!perms.has(Permissions.FLAGS.ADMINISTRATOR)) return interaction.reply({ content: "This command requires you to be an administrator", ephemeral: true })

    const channelMessages = await interaction.channel?.messages.fetch({ limit: 100 })

    if (!channelMessages)  return interaction.reply({ content: "Failed to get channel messages, ensure I have sufficient permissions", ephemeral: true })
    
    const botMessages = channelMessages.filter(m => m.author.id == this.ctx.bot.user?.id)

    if (!botMessages)  return interaction.reply({ content: "Failed to get bot messages, ensure I have sufficient permissions", ephemeral: true })

    const count = botMessages.size

    for (let i=0; i < count; i++) {
        let message = botMessages.at(i)
        if (!message || !message.deletable) continue;

        await message.delete()
    }

    return interaction.reply(`Successfully deleted ${count} messages`)
  }
}
