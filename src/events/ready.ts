import { Interaction } from 'discord.js';
import OriginEvent from '../lib/structures/Event';
import BotApplication from '../index';
import { BotContext } from '../typings';

export default class extends OriginEvent {
  constructor(ctx: BotApplication) {
    super(ctx, 'ready');
  }
  async execute(): Promise<void> {
      console.log('ready')
      this.ctx.bot.user?.setPresence({ activities: [], status: 'idle'})
  }
}
