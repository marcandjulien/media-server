import { MikroORM } from '@mikro-orm/core';
import fs from 'fs';
import path from 'path';
import mikroOrmConfig from '../src/mikro-orm.config';

(async () => {
  const orm = await MikroORM.init(mikroOrmConfig);
  const generator = orm.getSchemaGenerator();

  //   const dropDump = await generator.getDropSchemaSQL();
  //   console.log(dropDump);

  //   const createDump = await generator.getCreateSchemaSQL();
  //   console.log(createDump);

  //   const updateDump = await generator.getUpdateSchemaSQL();
  //   console.log(updateDump);

  // there is also `generate()` method that returns drop + create queries
  const dropAndCreateDump = await generator.generate();

  try {
    const data = fs.writeFileSync(path.join(__dirname, '../schema/schema.sql'), dropAndCreateDump);
    //file written successfully
  } catch (err) {
    console.error(err);
  }

  generator.execute;

  // or you can run those queries directly, but be sure to check them first!
  //   await generator.dropSchema();
  //   await generator.createSchema();
  //   await generator.updateSchema();

  await orm.close(true);
})();
