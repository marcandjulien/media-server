import { Collection, Entity, ManyToMany, ManyToOne, Property } from '@mikro-orm/core';
import { BaseEntity } from './BaseEntity';
import { Book } from './Book';
import { Chapter } from './Chapter';
import { Story } from './Story';
import { Tag } from './Tag';

@Entity()
export class Page extends BaseEntity {
  @Property()
  number!: string;

  @Property()
  fullpath!: string;

  @Property()
  filename!: string;

  @ManyToOne(() => Chapter)
  chapter!: Chapter;

  @ManyToOne(() => Book)
  book!: Book;

  @ManyToOne(() => Story)
  story!: Story;

  @ManyToMany(() => Tag, (tag) => tag.pages, { owner: true })
  tags = new Collection<Tag>(this);

  constructor(number: string) {
    super();
    this.number = number;
  }
}
