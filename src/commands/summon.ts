import { Command, Handler, IA } from '@discord-nestjs/core';
import { Injectable, Logger } from '@nestjs/common';
import { CommandInteraction, GuildMember } from 'discord.js';
import { DiscordMessageService } from '../clients/discord/discord.message.service';
import { DiscordVoiceService } from '../clients/discord/discord.voice.service';
import { defaultMemberPermissions } from '../utils/environment';

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
  async handler(@IA() interaction: CommandInteraction): Promise<void> {
    await interaction.deferReply();

    // Adjusted to check versions and access patterns
    let channelId: string | null = null;
    if (interaction.options.get) {
      // For discord.js v13+
      const channelOption = interaction.options.get('channel_id');
      channelId = channelOption ? channelOption.value as string : null;
    } else {
      // Fallback for older versions or unexpected behavior
      console.error('Unable to access interaction options using standard methods.');
    }

    const guildMember = interaction.member as GuildMember;

    let tryResult;
    if (channelId) {
      tryResult = await this.discordVoiceService.tryJoinChannelByIdAndEstablishVoiceConnection(
        guildMember.guild,
        channelId
      );
    } else {
      tryResult = await this.discordVoiceService.tryJoinChannelAndEstablishVoiceConnection(
        guildMember,
      );
    }

    if (!tryResult.success) {
      await interaction.editReply(tryResult.reply);
      return;
    }
    // Get channel name and adjust message
    const channelName = tryResult.voiceChannel.name;
    this.logger.debug(`Joined voice channel '${channelName}'`);
    await interaction.editReply({
      embeds: [
        this.discordMessageService.buildMessage({
          title: `Joined voice channel '${channelName}'`,
          description:
            "",
        }),
      ],
    });
  }
}