// summon.params.ts

import { Param, ParamType } from '@discord-nestjs/core';

export class SummonParams {
  @Param({
    name: 'channel_id',
    description: 'The ID of the voice channel to join',
    type: ParamType.STRING,
    required: false,
  })
  channelId?: string;
}