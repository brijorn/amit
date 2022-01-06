import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, MessageEmbed } from "discord.js";
import Command from "../../lib/structures/Command";
import { BotContext } from "../../typings";

export default class extends Command {
  constructor(ctx: BotContext) {
    super(
      ctx,
      new SlashCommandBuilder()
    .setName("skip")
    .setDescription("Skip a song in the queue"),
    )
  }

  async execute(interaction: CommandInteraction) {
    let guild = this.ctx.bot.guilds.cache.get(interaction.guildId);
    let member = guild?.members.cache.get(interaction.user.id);

    if (!member?.voice.channel) return interaction.reply({ content: 'You are not in a voice channel', ephemeral: true })
    if (member.voice.channel !== member.guild.me?.voice.channel) return interaction.reply({ content: 'You are not in my voice channel', ephemeral: true })


    
    const manager = this.ctx.music.songQueues.get(interaction.guildId)
    if (!manager) return interaction.reply({ content: 'There is no queue for this guild' })

    manager.skipSong()
    
    return interaction.reply({ embeds: [
        new MessageEmbed()
        .setDescription(`Sucessfully skipped to the next song`)
        .setColor('#80623e')
    ]})
    
  }
}
