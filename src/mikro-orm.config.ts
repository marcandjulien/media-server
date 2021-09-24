import { Options } from '@mikro-orm/core';
import { Logger } from '@nestjs/common';

const logger = new Logger('MikroORM');

const sqliteConfig = {
  entities: ['./dist/entities'],
  entitiesTs: ['./src/entities'],
  dbName: 'db.sqlite3',
  type: 'sqlite',
  debug: true,
  logger: logger.log.bind(logger),
  pool: {
    acquireTimeoutMillis: 120000,
  },
} as Options;

const postgresConfig = {
  entities: ['./dist/entities'],
  entitiesTs: ['./src/entities'],
  user: 'mediaserver',
  dbName: 'mediaserver',
  type: 'postgresql',
  debug: true,
  logger: logger.log.bind(logger),
  port: 35432,
} as Options;

export default postgresConfig;
