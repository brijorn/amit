import { AudioPlayer, AudioResource, VoiceConnection } from '@discordjs/voice';
import {
  Client,
  Collection,
  GuildMember,
  TextBasedChannels,
  VoiceChannel
} from 'discord.js';
import CommandHandler from '../handlers/CommandHandler';
import SongManager from '../lib/music/SongManager';

interface PartialBotContext {
  bot: Client;
  music: Collection<string, SongManager>;
}

interface BotContext extends PartialBotContext {
  commands: CommandHandler
}
interface SongQueue {
  playing: boolean;

  voiceChannel: VoiceChannel;

  player: AudioPlayer;

  volume: number;

  songs: Song[];

  connection: VoiceConnection;
}

interface Song {
  user: GuildMember;
  announced: boolean;

  channel: TextBasedChannels;

  timestamp: string;
  videoDetails: {
    title: string;
    url: string;
    duration: number;
    thumbnail: string;
    author: {
      name: string;
    };
  };

  resource: AudioResource;
}
