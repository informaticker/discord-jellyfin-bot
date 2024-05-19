// summon.command.ts

import { SlashCommandPipe } from '@discord-nestjs/common';
import { Command, Handler, IA, InteractionEvent } from '@discord-nestjs/core';
import { Injectable, Logger } from '@nestjs/common';
import { CommandInteraction, GuildMember } from 'discord.js';

import { DiscordMessageService } from '../../clients/discord/discord.message.service';
import { DiscordVoiceService } from '../../clients/discord/discord.voice.service';
import { defaultMemberPermissions } from '../../utils/environment';
import { SummonParams } from './summon.params';

@Injectable()
@Command({
  name: 'join',
  description: 'Join a specified voice channel or your current voice channel',
  defaultMemberPermissions,
})
export class SummonCommand {
  private readonly logger = new Logger(SummonCommand.name);

  constructor(
    private readonly discordVoiceService: DiscordVoiceService,
    private readonly discordMessageService: DiscordMessageService,
  ) {}

  @Handler()
  async handler(
    @InteractionEvent(SlashCommandPipe) dto: SummonParams,
    @IA() interaction: CommandInteraction,
  ): Promise<void> {
    await interaction.deferReply({ ephemeral: true });

    const guildMember = interaction.member as GuildMember;
    let tryResult;

    if (dto.channelId) {
      tryResult = await this.discordVoiceService.tryJoinChannelByIdAndEstablishVoiceConnection(
        guildMember.guild,
        dto.channelId
      );
    } else {
      tryResult = await this.discordVoiceService.tryJoinChannelAndEstablishVoiceConnection(
        guildMember
      );
    }

    if (!tryResult.success) {
      await interaction.editReply(tryResult.reply);
      return;
    }
    if (dto.channelId) {
      this.logger.debug(`Joined voice channel ${dto.channelId?.toString()}`);
      await interaction.editReply({
        embeds: [
          this.discordMessageService.buildMessage({
            title: `Joined voice channel '${dto.channelId?.toString()}'`,
            description: "I'm ready to play music!"
          }),
        ],
      });
    } else {
      this.logger.debug(`Joined voice channel ${guildMember.voice.channelId}`);
      await interaction.editReply({
        embeds: [
          this.discordMessageService.buildMessage({
            title: `Joined voice channel '${guildMember.voice.channelId}'`,
            description: "I'm ready to play music!"
          }),
        ],
      });
    }
  }
}