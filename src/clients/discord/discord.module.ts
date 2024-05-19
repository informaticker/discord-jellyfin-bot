// discord.module.ts
import { Module, OnModuleDestroy } from '@nestjs/common';

import { JellyfinClientModule } from '../jellyfin/jellyfin.module';
import { PlaybackModule } from '../../playback/playback.module';
import { DiscordStatusModule } from './discord.status.module'; // Adjust the path as necessary

import { DiscordConfigService } from './discord.config.service';
import { DiscordMessageService } from './discord.message.service';
import { DiscordVoiceService } from './discord.voice.service';

@Module({
  imports: [
    PlaybackModule,
    JellyfinClientModule,
    DiscordStatusModule, // Import DiscordStatusModule here
  ],
  controllers: [],
  providers: [DiscordConfigService, DiscordVoiceService, DiscordMessageService],
  exports: [DiscordConfigService, DiscordVoiceService, DiscordMessageService],
})
export class DiscordClientModule implements OnModuleDestroy {
  constructor(private readonly discordVoiceService: DiscordVoiceService) {}

  onModuleDestroy() {
    this.discordVoiceService.disconnectGracefully();
  }
}