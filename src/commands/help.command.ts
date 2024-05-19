import { Command, Handler, IA } from '@discord-nestjs/core';

import { Injectable } from '@nestjs/common';

import { CommandInteraction } from 'discord.js';

import { DiscordMessageService } from '../clients/discord/discord.message.service';
import { defaultMemberPermissions } from '../utils/environment';

@Injectable()
@Command({
  name: 'help',
  description: 'Get help if you&apos;re having problems with this bot',
  defaultMemberPermissions,
})
export class HelpCommand {
  constructor(private readonly discordMessageService: DiscordMessageService) {}

  @Handler()
  async handler(@IA() interaction: CommandInteraction): Promise<void> {
    await interaction.reply({
      embeds: [
        this.discordMessageService.buildMessage({
          title: 'Jellyfin Discord Bot',
          description:
            'Open source music bot',
          authorUrl: 'https://jellyfin.org',
          mixin(embedBuilder) {
            return embedBuilder.addFields([
              {
                name: 'Source code',
                value:
                  'https://github.com/manuel-rw/jellyfin-discord-music-bot',
                inline: true,
              },
            ]);
          },
        }),
      ],
    });
  }
}
