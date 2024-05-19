import { SlashCommandPipe } from '@discord-nestjs/common';
import { Command, Handler, IA, InteractionEvent } from '@discord-nestjs/core';
import { Logger } from '@nestjs/common';

import { Injectable } from '@nestjs/common/decorators';

import { CommandInteraction } from 'discord.js';
import { DiscordMessageService } from 'src/clients/discord/discord.message.service';
import { DiscordVoiceService } from 'src/clients/discord/discord.voice.service';
import { PlaybackService } from 'src/playback/playback.service';
import { sleepAsync } from '../../utils/timeUtils';
import { VolumeCommandParams } from './volume.params';
import { defaultMemberPermissions } from '../../utils/environment';
import { time } from 'console';

@Injectable()
@Command({
  name: 'volume',
  description: 'Change the volume',
  defaultMemberPermissions,
})
export class VolumeCommand {
  private readonly logger = new Logger(VolumeCommand.name);

  constructor(
    private readonly discordVoiceService: DiscordVoiceService,
    private readonly discordMessageService: DiscordMessageService,
    private readonly playbackService: PlaybackService,
  ) {}

  @Handler()
  async handler(
    @InteractionEvent(SlashCommandPipe) dto: VolumeCommandParams,
    @IA() interaction: CommandInteraction,
  ): Promise<void> {
    await interaction.deferReply({ ephemeral: true });

    if (!this.playbackService.getPlaylistOrDefault().hasActiveTrack()) {
      await interaction.editReply({
        embeds: [
          this.discordMessageService.buildMessage({
            title: "Unable to change your volume",
            description:
              'The bot is not playing any music or is not straming to a channel',
          }),
        ],
      });
      return;
    }

    const volume = dto.volume / 100;

    this.logger.debug(
      `Calculated volume ${volume} from dto param ${dto.volume}`,
    );

    this.discordVoiceService.changeVolume(volume);
    // Create embed to start volume change
    await interaction.editReply({
      embeds: [
        this.discordMessageService.buildMessage({
          title: `Changing volume to ${dto.volume.toFixed(0)}%`,
          description:
            'This may take a few seconds',
        }),
      ],
    });
    // Discord takes some time to react. Confirmation message should appear after actual change
    await sleepAsync(1500);
    // Warn the user if the volume is too high
    if (dto.volume > 200) {
      await interaction.editReply({
        embeds: [
          this.discordMessageService.buildMessage({
            title: `Volume set to ${dto.volume.toFixed(0)}%`,
            description:
              'You are playing with fire. Be careful with your ears.',
          }),
        ],
      });
      return;
    }
    await interaction.editReply({
      embeds: [
        this.discordMessageService.buildMessage({
          title: `Sucessfully set volume to ${dto.volume.toFixed(0)}%`,
          description:
            'Take care of your ears.',
        }),
      ],
    });
  }
}
