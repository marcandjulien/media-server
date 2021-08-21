import { Collection, Entity, ManyToMany, ManyToOne, OneToMany, Property } from '@mikro-orm/core';
import { BaseEntity } from './BaseEntity';
import { Book } from './Book';
import { Page } from './Page';
import { Story } from './Story';
import { Tag } from './Tag';

@Entity()
export class Chapter extends BaseEntity {
  @Property()
  number!: string;

  @Property()
  title!: string;

  @OneToMany(() => Page, (page) => page.chapter)
  pages = new Collection<Page>(this);

  @ManyToOne(() => Book)
  book!: Book;

  @ManyToOne(() => Story)
  story!: Story;

  @ManyToMany(() => Tag, (tag) => tag.chapters, { owner: true })
  tags = new Collection<Tag>(this);

  constructor(title: string, number: string) {
    super();
    this.title = title;
    this.number = number;
  }
}
