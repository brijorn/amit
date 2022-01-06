import { BotContext } from '../../typings';

export default class OriginEvent {
    ctx: BotContext;
    name: string;
    once = false;

    constructor(ctx: BotContext, name: string) {
        this.ctx = ctx;
        this.name = name;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    execute(..._args: unknown[]) {
        throw new Error('Woopsies something broke in the Event Handler.')
    }
}
