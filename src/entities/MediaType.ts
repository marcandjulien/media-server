import { Entity, Index, Property, Unique } from '@mikro-orm/core';
import { BaseEntity } from './BaseEntity';

@Entity()
@Index({ properties: ['name'] })
@Unique({ properties: ['name'] })
export class MediaType extends BaseEntity {
  @Property()
  name!: string;

  constructor(name: string) {
    super();
    this.name = name;
  }
}
