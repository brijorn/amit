import { join } from "path";
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
import { Collection } from "discord.js";
import { readdirSync, readFile } from "fs";
import OriginClient from "../lib/OriginClient";
import Command from "../lib/structures/Command";
import auth from "../config.json"
export default class CommandHandler extends Collection<string, Command> {
  bot: OriginClient;
  constructor(bot: OriginClient) {
    super();
    this.bot = bot;

    this.init().catch((err) => Promise.reject(new Error(err)));
  }

  async init(): Promise<CommandHandler> {
    const start = Date.now();

    const commands = await this.getCommands();

    commands.map((cmd) => {
      this.set(cmd.data.name, cmd);
    });

    if (process.argv.includes("--slash-log")) {
      let restCommands = commands.map((cmd) => cmd.data.toJSON());
      const rest = new REST({ version: "9" }).setToken(process.env.DISCORD_TOKEN);

      rest
        .put(
          Routes.applicationGuildCommands(
            auth.clientId,
            auth.developerGuildId,
          ),
          { body: restCommands }
        )
        .then(() =>
          console.log("Successfully registered application commands.")
        )
        .catch(console.error);
    }

    return this;
  }

  async getCommands(json = false): Promise<Command[]> {
    const path = join(__dirname, "..", "commands");

    const commands: Command[] = [];
    const modules = readdirSync(path);

    for (const module of modules) {
      // Loop through Commands in module
      let moduleCommands = readdirSync(`${path}/${module}`);
      moduleCommands.map((cmdFile) => {
        const cmdClass = ((r) => r.default || r)(
          require(`${path}/${module}/${cmdFile}`)
        );
        const cmd = new cmdClass(this.bot) as Command;
        commands.push(cmd);
      });
    }

    return commands;
  }
  fetch(name: string): Command | null {
    name = name.toLowerCase();
    if (this.has(name)) return this.get(name) as Command;
    else return null;
  }
}
