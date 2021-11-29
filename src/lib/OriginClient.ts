import { Client, Collection } from "discord.js";
import CommandHandler from "../handlers/CommandHandler";
import { OriginHandlers, SongQueue } from "../typings/origin";
import EventHandler from "../handlers/EventHandler";
import SongManager from "./music/SongManager";
export default class OriginClient extends Client {
  public commands = new CommandHandler(this);
  public events = new EventHandler(this);
  public handlers = {} as OriginHandlers;

  public songQueues: Collection<string, SongManager>;

  public constructor() {
    super({
      intents: ['GUILD_MEMBERS', 'GUILD_VOICE_STATES', 'GUILDS'],
    });
    if (process.env.DISCORD_TOKEN)
      this.login(process.env.DISCORD_TOKEN).catch((err) => console.log(err));
    else throw new Error("Missing Token");

	this.songQueues = new Collection();
  }
}
