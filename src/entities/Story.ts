import { Collection, Entity, ManyToMany, ManyToOne, OneToMany, Property } from '@mikro-orm/core';
import { Artist } from './Artist';
import { Author } from './Author';
import { BaseEntity } from './BaseEntity';
import { Book } from './Book';
import { Chapter } from './Chapter';
import { MediaType } from './MediaType';
import { Page } from './Page';
import { Tag } from './Tag';

@Entity()
export class Story extends BaseEntity {
  @Property()
  title!: string;

  @ManyToOne(() => MediaType)
  mediaType!: MediaType;

  @ManyToOne(() => Page)
  cover!: Page;

  @OneToMany(() => Page, (page) => page.story)
  pages = new Collection<Page>(this);

  @OneToMany(() => Chapter, (chapter) => chapter.story)
  chapters = new Collection<Chapter>(this);

  @OneToMany(() => Book, (book) => book.story)
  books = new Collection<Chapter>(this);

  @ManyToMany(() => Artist, (artist) => artist.stories, { owner: true })
  artists = new Collection<Artist>(this);

  @ManyToMany(() => Author, (author) => author.stories, { owner: true })
  authors = new Collection<Author>(this);

  @ManyToMany(() => Tag, (tag) => tag.stories, { owner: true })
  tags = new Collection<Tag>(this);

  constructor(title: string) {
    super();
    this.title = title;
  }
}
