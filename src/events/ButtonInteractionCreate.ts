import { Client, Interaction, MessageEmbed } from "discord.js";
import { commandError, commandSuccess, commandSuccessFollowUp } from "../lib/interactionHelpers";
import musicActions from "../lib/music/interaction";
import OriginEvent from "../lib/structures/Event";
import { BotContext } from "../typings";

export default class extends OriginEvent {
  constructor(ctx: BotContext) {
    super(ctx, "interactionCreate");
  }
  async execute(interaction: Interaction): Promise<any> {
    if (!interaction.isButton()) return;

    if (interaction.customId == "skipSong") {
      const manager = this.ctx.music.get(interaction.guildId);

      if (!manager || !manager.currentSong)
        return interaction.reply({
          content: "There are currently no songs playing in this guild",
        });

      manager.skipSong();

      return interaction.reply("Successfully skipped the current song");
    }
    if (interaction.customId == "pauseSong") {
      const manager = this.ctx.music.get(interaction.guildId);

      if (!manager || !manager.currentSong)
        return commandError(interaction, "There are currently no songs playing in this guild")

      manager.pause();

      interaction.update({ components: [musicActions(true)]})
      return commandSuccessFollowUp(interaction, "Successfully paused the song");
    }
    if (interaction.customId == "unpauseSong") {
      const manager = this.ctx.music.get(interaction.guildId);

      if (!manager || !manager.currentSong)
        return interaction.reply(
          "There are currently no songs playing in this guild"
        );

      if (!manager.paused()) return interaction.reply("Music is not paused");

      manager.unpause();

      interaction.update({ components: [musicActions(false)]})
      return commandSuccessFollowUp(interaction, 'Successfully unpaused the song')
    }
  }
}

function embed(action: string) {
  return new MessageEmbed()
    .setDescription(`Successfully ${action}`)
    .setColor("#80623e");
}
