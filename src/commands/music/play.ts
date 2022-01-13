import { SlashCommandBuilder } from '@discordjs/builders';
import { createAudioResource } from '@discordjs/voice';
import { CommandInteraction, MessageEmbed } from 'discord.js';
import ytdl from 'ytdl-core';
import SongManager from '../../lib/music/SongManager';
import Command from '../../lib/structures/Command';
import { BotContext, PartialBotContext, Song } from '../../typings';
import BotApplication from '../../index';
const yts = require('yt-search');
export default class extends Command {
  constructor(ctx: BotApplication) {
    super(
      ctx,
      new SlashCommandBuilder()
        .setName('play')
        .setDescription('Play a song')
        .addStringOption((option) =>
          option
            .setName('song')
            .setDescription('The name of the song you want to play')
            .setRequired(true)
        )
    );
  }

  async execute(interaction: CommandInteraction) {
    let guild = this.ctx.bot.guilds.cache.get(interaction.guildId);
    let member = guild?.members.cache.get(interaction.user.id);

    let voiceChannel = member?.voice.channel;
    if (!member || !voiceChannel || voiceChannel.type !== 'GUILD_VOICE')
      return interaction.reply({
        content: 'You must be in a voice channel to play music',
        ephemeral: true
      });

    await interaction.deferReply();

    const songArg = interaction.options.getString('song');

    const keywordSearch: { videos: VideoResult[] } = await yts(songArg!);

    if (keywordSearch.videos.length == 0)
      return interaction.editReply({
        content: `Could not find the song **${songArg}**`
      });

    const video = keywordSearch.videos.filter((v) => v.type == 'video')[0];

    // Get the Video from YTDL
    let getYtdlVideo;
    try {
      getYtdlVideo = ytdl(video.url, {
        filter: 'audioonly',
        highWaterMark: 1 << 25
      })
    } catch(err) {
      console.error(err)
      return interaction.reply("I received an error trying to get the song. The video may be restricted.")
    }

    const song: Song = {
      channel: interaction.channel!,

      videoDetails: {
        title: video.title,
        url: video.url,
        author: {
          name: video.author.name
        },
        thumbnail: video.thumbnail,
        duration: video.seconds
      },
      announced: false,
      resource: createAudioResource(getYtdlVideo),
      timestamp: video.timestamp,
      user: member
    };

    await interaction.editReply({
      embeds: [successEmbed(song, this.ctx.bot.user?.avatarURL()!)]
    });

    const queues = this.ctx.music;

    let queue = queues.get(interaction.guildId);
    if (!queue?.currentSong) {
      queues.set(interaction.guildId, new SongManager(this.ctx, voiceChannel));
      queue = queues.get(interaction.guildId)!;
      queue.addSong(song);
      queue?.start();
    } else {
      queue.addSong(song);
    }

    if (!queue) return interaction.editReply('Could not fetch server queue');
  }
}

const successEmbed = (song: Song, botAvatar: string) => {
  const details = song.videoDetails;
  return new MessageEmbed()
    .setColor('BLURPLE')
    .setDescription(
      `\`${song.videoDetails.title}\` Successfully added to Queue`
    )
    .setURL(details.url)
    .setThumbnail(details.thumbnail)
    .setAuthor(details.author.name, botAvatar);
};

interface VideoResult {
  type: string;
  videoId: string;
  url: string;
  title: string;
  description: string;
  image: string;
  thumbnail: string;
  seconds: number;
  timestamp: string;
  duration: any;
  ago: string;
  views: number;
  author: {
    name: string;
    url: string;
  };
}
