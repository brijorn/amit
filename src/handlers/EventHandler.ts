import { join, parse } from 'path';
import { Collection } from 'discord.js'
import OriginClient from '../lib/OriginClient';
import { readdirSync, readFileSync } from 'fs'
import OriginEvent from '../lib/structures/Event';
export default class EventHandler extends Collection<string, Event> {
    bot: OriginClient;

    constructor(bot: OriginClient) {
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
