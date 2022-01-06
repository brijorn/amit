import {
  AudioPlayer, AudioPlayerStatus,
  createAudioPlayer, joinVoiceChannel,
  VoiceConnection
} from "@discordjs/voice";
import dayjs from "dayjs";
import duration from 'dayjs/plugin/duration';
import {
  GuildMember, MessageEmbed,
  VoiceChannel
} from "discord.js";
import { BotContext, Song } from "../../typings";
import BotApplication from '../../index';
import { createDiscordJSAdapter } from "./adapter";
import musicActions from "./interaction";

dayjs.extend(duration)
export default class {
  private ctx: BotApplication;
  private queue: Song[];
  private readonly previousSongs: Song[];
  private readonly player: AudioPlayer;
  private connection: VoiceConnection;

  guildId: string;
  public currentSong?: Song;
  status: "idle" | "buffering" | "playing";
  constructor(ctx: BotApplication, channel: VoiceChannel) {
    this.ctx = ctx;
    this.queue = [];
    this.previousSongs = [];
    this.status = "idle";
    this.player = createAudioPlayer();
    this.guildId = channel.guildId;
    this.connection = joinVoiceChannel({
      channelId: channel.id,
      guildId: channel.guildId,
      adapterCreator: createDiscordJSAdapter(channel),
    });
    this.currentSong = undefined;

    this.player.on(AudioPlayerStatus.Playing, () => this.playing());
    this.player.on(AudioPlayerStatus.Idle, () => this.nextSong());
  }

  async start() {
    this.currentSong = this.queue.shift();
    if (!this.currentSong) throw new Error("Cannot start queue without songs");

    this.player.play(this.currentSong.resource);
    this.connection.subscribe(this.player);
  }

  nextSong() {
    this.previousSongs.push(this.currentSong!);
    this.currentSong = this.queue.shift();

    if (!this.currentSong) {
      const lastSong = this.previousSongs.at(-1)!;
      lastSong.channel.send({
        embeds: [
          new MessageEmbed({
            description: "No more songs in the queue, imma dip in 5 minutes",
          }),
        ],
      });

      setTimeout(() => this.disconnect(), 60_000 * 5);
    } else {
      this.player.play(this.currentSong?.resource);
    }
  }

  empty() {
    return this.queue.length == 0;
  }
  disconnect() {
    const songs = this.previousSongs;
    const lastSong = songs.at(-1);

    const mostPlayed = mode(songs);

    lastSong?.channel.send({
      embeds: [
        new MessageEmbed()
          .setTitle("Disconnected")
          .setDescription(
            "I left the voice channel due to inactivity for 5 minutes, heres some cool stats"
          )
          .addField(
            "Total Songs Played",
            this.previousSongs.length.toString(),
            true
          )
          .addField(
            "Most Played Songs",
            `${mostPlayed.user}(${mostPlayed.count})`,
            true
          ),
      ],
    });

    this.player.stop();
    this.connection.destroy();
    this.ctx.music.delete(this.guildId);
  }
  skipSong() {
    this.player.stop();
  }

  formatQueue() {

    return this.queue
      .map((s, i) => {
        return `\`${i + 1}. ${s.videoDetails.title}\`(${s.timestamp}) - Requested by ${s.user}`;
      })
      .join("\n");
  }
  queueDuration() {
    let total = 0;
    
    this.queue.forEach(s => total = total + s.videoDetails.duration)

    const duration = dayjs.duration(total * 1000)

    const minAndSeconds = `${duration.minutes()}:${duration.seconds()}`
    return duration.hours() > 0 ? `${duration.hours()}:${minAndSeconds}` : minAndSeconds
  }
  paused = () => this.player.state.status === AudioPlayerStatus.Paused;
  pause = () => this.player.pause();
  unpause = () => this.player.unpause();
  private playing() {
    // The channel where the command was called from
    const song = this.currentSong!;
    if (song.announced) return;

    // Evemt was firing twice
    song.announced = true;

    song.channel.send({
      embeds: [
        new MessageEmbed()
          .setAuthor(
            song.videoDetails.author.name,
            this.ctx.bot.user?.avatarURL()!
          )
          .setColor("#fac17a")
          .setDescription(
            `Now playing \`${song.videoDetails.title}\` Requested by ${
              song.user.nickname || song.user.displayName
            }`
          )
          .setFooter(`Length: ${song.timestamp}`),
      ],
      components: [musicActions(this.paused())],
    });
  }

  public addSong(song: Song): { song: Song; position: number } {
    this.queue.push(song);
    return {
      song,
      position: this.queue.indexOf(song),
    };
  }
}

function mode(songs: Song[]) {
  let counts: { count: number; user: GuildMember }[] = [];

  for (const song of songs) {
    const countUser = counts.find((x) => x.user.id == song.user.id);
    if (countUser) {
      countUser.count = countUser.count + 1;
    } else {
      counts.push({ count: 1, user: song.user });
    }
  }

  counts = counts.sort((a, b) => {
    if (a.count < b.count) {
      return -1;
    }
    if (a.count > b.count) {
      return 1;
    }
    return 0;
  });
  console.log(counts);
  return counts[0];
}
