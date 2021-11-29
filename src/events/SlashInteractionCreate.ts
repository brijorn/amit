import { Interaction } from "discord.js";
import OriginClient from "../lib/OriginClient";
import OriginEvent from "../lib/structures/Event";

export default class extends OriginEvent {

    constructor(bot: OriginClient) {
        super(bot, "interactionCreate")
    }
    async execute(interaction: Interaction): Promise<void> {
        if (!interaction.isCommand()) return;
        
        
        const cmd = this.bot.commands.fetch(interaction.commandName)

        if (cmd) cmd.execute(interaction)
    }
}