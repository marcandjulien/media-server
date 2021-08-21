import { Collection, Entity, ManyToMany, Property } from '@mikro-orm/core';
import { BaseEntity } from './BaseEntity';
import { Story } from './Story';

@Entity()
export class Artist extends BaseEntity {
  @Property()
  name!: string;

  @Property()
  penName!: string;

  @ManyToMany(() => Story, (story) => story.artists)
  stories = new Collection<Story>(this);
}
