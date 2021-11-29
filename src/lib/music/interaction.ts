import { MessageActionRow, MessageButton } from "discord.js";

const skipButton =     new MessageButton()
.setCustomId('skipSong')
.setLabel('Skip')
.setStyle('PRIMARY')
export const playingMusicActions = new MessageActionRow().addComponents(
    new MessageButton()
    .setCustomId('pauseSong')
    .setLabel('Pause')
    .setStyle('DANGER'),
    skipButton
)

export const pausedMusicActions = new MessageActionRow().addComponents(
    new MessageButton()
    .setCustomId('unpauseSong')
    .setLabel('Unpause')
    .setStyle('SUCCESS'),
    skipButton
)

export const musicActions = (paused: boolean) => {
    return paused ? pausedMusicActions : playingMusicActions
}

export default musicActions