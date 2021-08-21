import { Options } from '@mikro-orm/core';
import { Logger } from '@nestjs/common';

const logger = new Logger('MikroORM');
const config = {
  entities: ['./dist/entities'],
  entitiesTs: ['./src/entities'],
  dbName: 'db.sqlite3',
  type: 'sqlite',
  debug: true,
  logger: logger.log.bind(logger),
} as Options;

export default config;
