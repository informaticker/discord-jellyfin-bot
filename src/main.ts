import { LogLevel } from '@nestjs/common/services';
import { NestFactory } from '@nestjs/core';
import { INestApplication } from '@nestjs/common';

import { AppModule } from './app.module';
import { StatusService } from './clients/discord/discord.status.service';
import { time } from 'console';

function getLoggingLevels(): LogLevel[] {
  if (!process.env.LOG_LEVEL) {
    return ['error', 'warn', 'log'];
  }

  switch (process.env.LOG_LEVEL.toLowerCase()) {
    case 'error':
      return ['error'];
    case 'warn':
      return ['error', 'warn'];
    case 'log':
      return ['error', 'warn', 'log'];
    case 'debug':
      return ['error', 'warn', 'log', 'debug'];
    case 'verbose':
      return ['error', 'warn', 'log', 'debug', 'verbose'];
    default:
      console.log(`Failed to process log level ${process.env.LOG_LEVEL}`);
      return ['error', 'warn', 'log'];
  }
}

export let app: INestApplication;

async function bootstrap() {
  app = await NestFactory.create(AppModule, {
    logger: getLoggingLevels(),
  });

  // Retrieve the StatusService from the app's dependency injector
  const statusService = app.get(StatusService);

  // Call clearStatus on the StatusService instance
  app.enableShutdownHooks();
  await app.listen(3002);
  statusService.clearStatus();
}

bootstrap();