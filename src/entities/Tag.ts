import { Collection, Entity, ManyToMany, Property } from '@mikro-orm/core';
import { BaseEntity } from './BaseEntity';
import { Book } from './Book';
import { Chapter } from './Chapter';
import { Page } from './Page';
import { Story } from './Story';

@Entity()
export class Tag extends BaseEntity {
  @Property()
  name!: string;

  @ManyToMany(() => Page, (page) => page.tags)
  pages = new Collection<Page>(this);

  @ManyToMany(() => Chapter, (chapter) => chapter.tags)
  chapters = new Collection<Chapter>(this);

  @ManyToMany(() => Book, (book) => book.tags)
  books = new Collection<Book>(this);

  @ManyToMany(() => Story, (story) => story.tags)
  stories = new Collection<Story>(this);
}
