import Dexie from 'dexie';

export interface Comments {
  meet_url: string;
  meet_title: string;
  comment: string;
  created: string;
  modified: string;
}

class DB extends Dexie {
  comments: Dexie.Table<Comments, string>;

  constructor() {
    super('meet_chrome_extention');
    this.version(1).stores({
      comments: '&[meet_url+created]',
    });

    this.comments = this.table('comments');
  }
}

export const IndexDB = new DB();
