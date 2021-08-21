import { Collection, Entity, ManyToMany, ManyToOne, OneToMany, Property } from '@mikro-orm/core';
import { BaseEntity } from './BaseEntity';
import { Chapter } from './Chapter';
import { Page } from './Page';
import { Story } from './Story';
import { Tag } from './Tag';

@Entity()
export class Book extends BaseEntity {
  @Property()
  number!: string;

  @Property()
  title!: string;

  @OneToMany(() => Page, (page) => page.book)
  pages = new Collection<Page>(this);

  @OneToMany(() => Chapter, (chapter) => chapter.book)
  chapters = new Collection<Chapter>(this);

  @ManyToOne(() => Story)
  story!: Story;

  @ManyToMany(() => Tag, (tag) => tag.books, { owner: true })
  tags = new Collection<Tag>(this);
}
