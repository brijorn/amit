import { SlashCommandBuilder } from "@discordjs/builders";
import { ApplicationCommand, Interaction } from "discord.js"
import OriginClient from "../OriginClient";

export default class Command {
    data: SlashCommandBuilder;
    bot: OriginClient;

    constructor(bot: OriginClient, data: any) {
        this.data = data;
        this.bot = bot
    }

    execute (interaction: Interaction): Promise<unknown> | undefined {
        throw new Error('Idiot It doesnt work')
    }


}