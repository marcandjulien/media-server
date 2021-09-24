import {
  Collection,
  Entity,
  Index,
  ManyToMany,
  ManyToOne,
  OneToMany,
  Property,
  QueryOrder,
} from '@mikro-orm/core';
import { BaseEntity } from './BaseEntity';
import { Book } from './Book';
import { File } from './File';
import { Page } from './Page';
import { Story } from './Story';
import { Tag } from './Tag';

@Entity()
export class Chapter extends BaseEntity {
  @Property()
  number!: string;

  @Index()
  @Property()
  sort!: string;

  @Index()
  @Property()
  title!: string;

  @ManyToOne(() => File, { nullable: true, onDelete: 'set null' })
  cover!: File;

  @OneToMany(() => Page, (page) => page.chapter, {
    orderBy: { sort: QueryOrder.ASC },
    orphanRemoval: true,
  })
  pages = new Collection<Page>(this);

  @ManyToOne(() => Book, { nullable: true, onDelete: 'cascade' })
  book!: Book;

  @ManyToOne(() => Story, { onDelete: 'cascade' })
  story!: Story;

  @ManyToMany(() => Tag, (tag) => tag.chapters, { owner: true })
  tags = new Collection<Tag>(this);

  constructor(title: string, number: string) {
    super();
    this.title = title;
    this.number = number;
    this.sort = number.padStart(12, '0');
  }
}
