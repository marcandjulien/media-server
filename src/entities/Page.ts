import { Collection, Entity, Index, ManyToMany, ManyToOne, Property } from '@mikro-orm/core';
import { BaseEntity } from './BaseEntity';
import { Book } from './Book';
import { Chapter } from './Chapter';
import { File } from './File';
import { Story } from './Story';
import { Tag } from './Tag';

@Entity()
export class Page extends BaseEntity {
  @Index()
  @Property()
  number!: string;

  @Index()
  @Property()
  sort!: string;

  @ManyToOne(() => File, { eager: true, onDelete: 'set null' })
  file!: File;

  @ManyToOne(() => Chapter, { nullable: true, onDelete: 'cascade' })
  chapter!: Chapter;

  @ManyToOne(() => Book, { nullable: true, onDelete: 'cascade' })
  book!: Book;

  @ManyToOne(() => Story, { onDelete: 'cascade' })
  story!: Story;

  // Join strategy sur les tags?
  @ManyToMany(() => Tag, (tag) => tag.pages, { owner: true })
  tags = new Collection<Tag>(this);

  @Property({ persist: false })
  get fileUrl() {
    return `${process.env.HOSTNAME}/files/${this.file.uuid}/download/${this.file.filename}`;
  }

  constructor(number: string) {
    super();
    this.number = number;
    this.sort = number.padStart(12, '0');
  }
}
