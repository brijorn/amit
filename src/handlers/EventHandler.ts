import { Client, Collection } from 'discord.js';
import { readdirSync } from 'fs';
import { join } from 'path';
import OriginEvent from '../lib/structures/Event';
import { BotContext } from '../typings';
export default class EventHandler extends Collection<string, Event> {
    private bot: Client;

    constructor(bot: Client) {
        super();

        this.bot = bot;

        this.init().catch((err) => console.error(err));
    }

    async init(): Promise<void> {
        const path = join(__dirname, '..', 'events');
        const start = Date.now();

        const events = readdirSync(path)

        for (const eventFile of events) {
            // Loop through Commands in module
            let EventClass = ((r) => r.default || r)(
                require(`${path}/${eventFile}`)
              );
            const event = new EventClass(this.bot) as OriginEvent
            this.bot[event.once ? 'once' : 'on'](event.name, (...args: unknown[]) => event.execute(...args));
        }
        return Promise.resolve()
    }
}
