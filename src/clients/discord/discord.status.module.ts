// discord-status.module.ts
import { Module } from '@nestjs/common';
import StatusService from './discord.status.service';
import { DiscordModule } from '@discord-nestjs/core';

@Module({
  imports: [DiscordModule.forFeature()],
  providers: [StatusService],
  exports: [StatusService],
})
export class DiscordStatusModule {}
