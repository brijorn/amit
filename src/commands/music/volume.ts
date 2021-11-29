import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, Interaction } from "discord.js";
import OriginClient from "../../lib/OriginClient";
import Command from "../../lib/structures/Command";

export default class extends Command {
  constructor(bot: OriginClient) {
    super(
      bot,
      new SlashCommandBuilder()
    .setName("volume")
    .setDescription("Control the volume of the player, value must be between 0 and 5")
    .addNumberOption(option =>
      option.setName("volume").setDescription("The volume to set the music to").setRequired(true)),
    )
  }

  async execute(interaction: CommandInteraction) {

    let guild = this.bot.guilds.cache.get(interaction.guildId);
    let member = guild?.members.cache.get(interaction.user.id);

    if (!member?.voice.channel) return interaction.reply({ content: 'You are not in a voice channel', ephemeral: true })
    if (member.voice.channel !== member.guild.me?.voice.channel) return interaction.reply({ content: 'You are not in my voice channel', ephemeral: true })
    
    const volume = interaction.options.getNumber("volume");
    if (!volume) throw new Error('Volume is null')

    if (volume == 0 || volume > 5) return interaction.reply({ content: 'Invalid volume, give a value between 0 and 5', ephemeral: true})
    const manager = this.bot.songQueues.get(interaction.guildId)
    if (!manager) return interaction.reply({ content: 'There is no queue for this guild' })

    const currentSong = manager.currentSong
    if (!currentSong) return interaction.reply({ content: 'There is no song currently playing', ephemeral: true })

    currentSong.resource.volume?.setVolume(volume!)
    
    return interaction.reply(`Successfully set the volume to **${volume}**`)
    
  }
}
