import { Injectable } from '@nestjs/common';
import { InjectDiscordClient } from '@discord-nestjs/core';
import { Client, ActivityType } from 'discord.js';

@Injectable()
export class StatusService {
    constructor(
        @InjectDiscordClient()
        private readonly client: Client,
    ) {}

    updateStatus(text: string): void {
        this.client.user?.setPresence({
            activities: [{
                name: text,
                type: ActivityType.Listening,
            }],
            status: 'dnd',
        });
    }
    clearStatus(): void {
        this.client.user?.setPresence({
            activities: [],
            status: 'idle',
        });
    }
}

export default StatusService;