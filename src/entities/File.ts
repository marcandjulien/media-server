import { Entity, ManyToOne, Property } from '@mikro-orm/core';
import path from 'path';
import { BaseEntity } from './BaseEntity';
import { FileProvider } from './FileProvider';

export enum Provider {
  FILE = 'file',
}

@Entity()
export class File extends BaseEntity {
  @ManyToOne(() => FileProvider, { hidden: true })
  provider!: FileProvider;

  @Property({ hidden: true })
  fullpath!: string;

  @Property({ hidden: true })
  relativepath!: string;

  @Property() // { hidden: true }
  filename!: string;

  @Property({ hidden: true })
  extension!: string;

  @Property({ hidden: true })
  isArchive!: boolean;

  @Property({ nullable: true, hidden: true })
  archivepath!: string;

  @Property()
  hash!: string;

  @Property({ persist: false })
  get fileUrl() {
    return `${process.env.HOSTNAME}/files/${this.uuid}/download/${this.filename}`;
  }

  constructor(
    provider: FileProvider,
    fullpath: string,
    hash: string,
    isArchive = false,
    archivepath?: string,
  ) {
    super();
    this.provider = provider;
    this.fullpath = fullpath;
    this.hash = hash;
    this.isArchive = isArchive;
    this.archivepath = archivepath;

    this.relativepath = this.fullpath; // Not implemented, is it really useful?
    this.filename = path.basename(fullpath);
    this.extension = path.extname(fullpath);
  }
}
