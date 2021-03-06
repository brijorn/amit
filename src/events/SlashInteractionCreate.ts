import { Interaction } from "discord.js";
import OriginEvent from "../lib/structures/Event";
import BotApplication from '../index';
import { BotContext } from "../typings";

export default class extends OriginEvent {

    constructor(ctx: BotApplication) {
        super(ctx, "interactionCreate")
    }
    async execute(interaction: Interaction): Promise<void> {
        if (!interaction.isCommand()) return;
        
        
        const cmd = this.ctx.commands.fetch(interaction.commandName)

        if (cmd) cmd.execute(interaction)
    }
}
