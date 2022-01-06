import { SlashCommandBuilder } from "@discordjs/builders";
import { Interaction } from "discord.js";
import { BotContext } from "../../typings";

export default class Command {
    data: SlashCommandBuilder;
    ctx: BotContext;

    constructor(ctx: BotContext, data: any) {
        this.data = data;
        this.ctx = ctx
    }

    execute (interaction: Interaction): Promise<unknown> | undefined {
        throw new Error('Idiot It doesnt work')
    }


}