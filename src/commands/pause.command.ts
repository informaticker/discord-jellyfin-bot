import { Command, Handler, IA } from '@discord-nestjs/core';

import { Injectable } from '@nestjs/common';

import { CommandInteraction } from 'discord.js';

import { DiscordMessageService } from '../clients/discord/discord.message.service';
import { DiscordVoiceService } from '../clients/discord/discord.voice.service';
import { defaultMemberPermissions } from '../utils/environment';
import { PlaybackService } from 'src/playback/playback.service';

@Injectable()
@Command({
  name: 'pause',
  description: 'Pause or resume the playback of the current track',
  defaultMemberPermissions,
})
export class PausePlaybackCommand {
  constructor(
    private readonly discordVoiceService: DiscordVoiceService,
    private readonly discordMessageService: DiscordMessageService,
    private readonly playbackService: PlaybackService,
  ) {}

  @Handler()
  async handler(@IA() interaction: CommandInteraction): Promise<void> {
    // Check if the bot is in a voice channel
    await interaction.deferReply({ ephemeral: true });
    if (!this.playbackService.getPlaylistOrDefault().hasActiveTrack()) {
      await interaction.editReply({
        embeds: [
          this.discordMessageService.buildErrorMessage({
            title: "Unable to change playback state",
            description:
              'The bot is not playing any music.',
          }),
        ],
      });
      return;
    }
    const shouldBePaused = this.discordVoiceService.togglePaused();
    await interaction.editReply({
      embeds: [
        this.discordMessageService.buildMessage({
          title: shouldBePaused ? 'Paused' : 'Unpaused',
        }),
      ],
    });
  }
}
