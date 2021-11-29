import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, Interaction } from "discord.js";
import { commandError, commandSuccess } from "../../lib/interactionHelpers";
import OriginClient from "../../lib/OriginClient";
import Command from "../../lib/structures/Command";

export default class extends Command {
  constructor(bot: OriginClient) {
    super(
      bot,
      new SlashCommandBuilder()
        .setName("pause")
        .setDescription("Pause the current song")
    );
  }

  async execute(interaction: CommandInteraction) {
    let guild = this.bot.guilds.cache.get(interaction.guildId);
    let member = guild?.members.cache.get(interaction.user.id);

    if (!member?.voice.channel) return interaction.reply({ content: 'You are not in a voice channel', ephemeral: true })
    if (member.voice.channel !== member.guild.me?.voice.channel) return interaction.reply({ content: 'You are not in my voice channel', ephemeral: true })
    
    const manager = this.bot.songQueues.get(
        interaction.guildId
      );
    
      const currentSong = manager?.currentSong
  
      if (!manager || !currentSong) {
        return interaction.reply({
          content: "There are currently no songs playing",
          ephemeral: true,
        });
    }

    const pause = manager.pause()

    if (pause) return commandSuccess(interaction, 'Successfully paused the song')
    else return commandError(interaction, 'Could not pause the song, try again')

  }
}
