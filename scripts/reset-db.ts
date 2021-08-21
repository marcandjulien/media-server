import { MikroORM } from '@mikro-orm/core';
import fs from 'fs';
import path from 'path';
import mikroOrmConfig from '../src/mikro-orm.config';

(async () => {
  const orm = await MikroORM.init(mikroOrmConfig);
  const generator = orm.getSchemaGenerator();

  // Run schema
  const schema = fs.readFileSync(path.join(__dirname, '../schema/schema.sql'), 'utf8');
  await generator.execute(schema);

  await orm.close(true);
})();
