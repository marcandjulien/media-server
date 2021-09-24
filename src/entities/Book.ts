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
import { Chapter } from './Chapter';
import { File } from './File';
import { Page } from './Page';
import { Story } from './Story';
import { Tag } from './Tag';

@Entity()
export class Book extends BaseEntity {
  @Index()
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

  @OneToMany(() => Page, (page) => page.book, { orphanRemoval: true })
  pages = new Collection<Page>(this);

  @OneToMany(() => Chapter, (chapter) => chapter.book, {
    orderBy: { sort: QueryOrder.ASC },
    orphanRemoval: true,
  })
  chapters = new Collection<Chapter>(this);

  @ManyToOne(() => Story, { onDelete: 'cascade' })
  story!: Story;

  @ManyToMany(() => Tag, (tag) => tag.books, { owner: true })
  tags = new Collection<Tag>(this);

  constructor(title: string, number: string) {
    super();
    this.title = title;
    this.number = number;
    this.sort = number.padStart(12, '0');
  }
}
