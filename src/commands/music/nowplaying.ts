import { SlashCommandBuilder } from "@discordjs/builders";
import {
  CommandInteraction,
  Interaction,
  MessageActionRow,
  MessageButton,
  MessageEmbed,
} from "discord.js";
import musicActions from "../../lib/music/interaction";
import Command from "../../lib/structures/Command";
import { BotContext } from "../../typings";

export default class extends Command {
  constructor(ctx: BotContext) {
    super(
      ctx,
      new SlashCommandBuilder()
        .setName("nowplaying")
        .setDescription("View the song that is currently playing")
    );
  }

  async execute(interaction: CommandInteraction) {
    const button = new MessageButton().setCustomId("skipSong").setLabel("Skip").setStyle('PRIMARY');
    const row = new MessageActionRow().addComponents(button);

    const manager = this.ctx.music.songQueues.get(
      interaction.guildId
    );
    const currentSong = manager?.currentSong

    if (!manager || !currentSong) {
      return interaction.reply({
        content: "There are currently no songs playing",
        ephemeral: true,
      });
    }


    await interaction.reply({
      embeds: [
        new MessageEmbed()
          .setAuthor("Now Playing", this.ctx.bot.user!.avatarURL()!)
          .setDescription(
            `[${currentSong.videoDetails.title}](${currentSong.videoDetails.url})\n\n\`Requested by:\` ${currentSong.user}`
          ),
      ],
      components: [musicActions(manager.paused())],
    });
  }
}
