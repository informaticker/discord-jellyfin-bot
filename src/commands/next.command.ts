import { Command, Handler, IA } from '@discord-nestjs/core';

import { Injectable } from '@nestjs/common';

import { CommandInteraction } from 'discord.js';

import { PlaybackService } from '../playback/playback.service';
import { DiscordMessageService } from '../clients/discord/discord.message.service';
import { defaultMemberPermissions } from '../utils/environment';

@Command({
  name: 'next',
  description: 'Go to the next track in the playlist',
  defaultMemberPermissions,
})
@Injectable()
export class SkipTrackCommand {
  constructor(
    private readonly playbackService: PlaybackService,
    private readonly discordMessageService: DiscordMessageService,
  ) {}

  @Handler()
  async handler(@IA() interaction: CommandInteraction): Promise<void> {
    await interaction.deferReply({ ephemeral: true });
    if (!this.playbackService.getPlaylistOrDefault().hasActiveTrack()) {
      await interaction.editReply({
        embeds: [
          this.discordMessageService.buildErrorMessage({
            title: 'There is no next track',
          }),
        ],
      });
      return;
    }

    this.playbackService.getPlaylistOrDefault().setNextTrackAsActiveTrack();
    await interaction.editReply({
      embeds: [
        this.discordMessageService.buildMessage({
          title: 'Went to next track',
        }),
      ],
    });
  }
}
