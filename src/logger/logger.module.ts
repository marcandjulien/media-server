import { Module } from '@nestjs/common';
import { CustomLogger } from './custom-logger.service';

@Module({
  providers: [CustomLogger],
  exports: [CustomLogger],
})
export class LoggerModule {}
