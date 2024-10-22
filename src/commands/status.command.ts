import {
  Command,
  Handler,
  IA,
  InjectDiscordClient,
} from '@discord-nestjs/core';

import { getSystemApi } from '@jellyfin/sdk/lib/utils/api/system-api';

import { Injectable } from '@nestjs/common';

import { Client, CommandInteraction, Status } from 'discord.js';

import { formatDuration, intervalToDuration } from 'date-fns';

import { DiscordMessageService } from '../clients/discord/discord.message.service';
import { JellyfinService } from '../clients/jellyfin/jellyfin.service';
import { Constants } from '../utils/constants';

@Command({
  name: 'status',
  description: 'Display helpful information.',
  defaultMemberPermissions: 'ViewChannel',
})
@Injectable()
export class StatusCommand {
  constructor(
    @InjectDiscordClient()
    private readonly client: Client,
    private readonly discordMessageService: DiscordMessageService,
    private readonly jellyfinService: JellyfinService,
  ) {}

  @Handler()
  async handler(@IA() interaction: CommandInteraction): Promise<void> {
    await interaction.reply({
      embeds: [
        this.discordMessageService.buildMessage({
          title: 'Retrieving status information...',
        }),
      ],
    });

    const ping = this.client.ws.ping;
    const status = Status[this.client.ws.status];

    const interval = intervalToDuration({
      start: this.client.uptime ?? 0,
      end: 0,
    });
    const formattedDuration = formatDuration(interval);

    const jellyfinSystemApi = getSystemApi(this.jellyfinService.getApi());
    const jellyfinSystemInformation = await jellyfinSystemApi.getSystemInfo();

    await interaction.editReply({
      embeds: [
        this.discordMessageService.buildMessage({
          title: 'Discord Bot Status',
          mixin(embedBuilder) {
            return embedBuilder.addFields([
              {
                name: 'Bot Version',
                value: Constants.Metadata.Version.All(),
                inline: true,
              },
              {
                name: 'Ping to Discord endpoint',
                value: `${ping}ms`,
                inline: true,
              },
              {
                name: 'Discord Bot Status',
                value: `${status}`,
                inline: true,
              },
              {
                name: 'Discord Bot Uptime',
                value: `${formattedDuration}`,
                inline: false,
              }
            ]);
          },
        }),
      ],
    });
  }
}
