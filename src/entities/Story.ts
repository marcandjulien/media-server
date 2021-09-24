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
import { Artist } from './Artist';
import { Author } from './Author';
import { BaseEntity } from './BaseEntity';
import { Book } from './Book';
import { Chapter } from './Chapter';
import { File } from './File';
import { MediaType } from './MediaType';
import { Page } from './Page';
import { Tag } from './Tag';

@Entity()
export class Story extends BaseEntity {
  @Index()
  @Property()
  title!: string;

  @ManyToOne(() => MediaType)
  mediaType!: MediaType;

  @ManyToOne(() => File, { nullable: true, onDelete: 'set null' })
  cover!: File;

  @OneToMany(() => Chapter, (chapter) => chapter.story, {
    orderBy: { sort: QueryOrder.ASC },
    orphanRemoval: true,
  })
  chapters = new Collection<Chapter>(this);

  @OneToMany(() => Book, (book) => book.story, { orphanRemoval: true })
  books = new Collection<Chapter>(this);

  @OneToMany(() => Page, (page) => page.story, { orphanRemoval: true })
  pages = new Collection<Page>(this);

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
