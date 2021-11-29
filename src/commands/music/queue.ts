import { SlashCommandBuilder } from "@discordjs/builders";
import {
    CommandInteraction, MessageActionRow,
    MessageButton,
    MessageEmbed
} from "discord.js";
import { commandError } from "../../lib/interactionHelpers";
import musicActions from "../../lib/music/interaction";
import OriginClient from "../../lib/OriginClient";
import Command from "../../lib/structures/Command";

export default class extends Command {
  constructor(bot: OriginClient) {
    super(
      bot,
      new SlashCommandBuilder()
        .setName("queue")
        .setDescription("View all the songs currently queued to play")
    );
  }

  async execute(interaction: CommandInteraction) {
    const button = new MessageButton().setCustomId("skipSong").setLabel("Skip").setStyle('PRIMARY');
    const row = new MessageActionRow().addComponents(button);

    const manager = this.bot.songQueues.get(
      interaction.guildId
    );

    if (!manager || (!manager.currentSong && manager.empty())) return commandError(interaction, 'There are no songs currently playing in this guild')

    const current = manager.currentSong!
    await interaction.reply({
      embeds: [
        new MessageEmbed()
          .setAuthor("Queue", this.bot.user!.avatarURL()!)
          .setDescription(
            manager.formatQueue() + `\n\n**Total Length: ${manager.queueDuration()}**` || '*Queue is emptier than my brain*'
          )
          .addField('Current Song', `\`${current.videoDetails.title}[${current.timestamp}]\` Requested by ${current.user}`)
      ],
      components: [musicActions(manager.paused())],
    });
  }
}
