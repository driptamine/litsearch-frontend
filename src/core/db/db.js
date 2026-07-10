import Dexie from 'dexie';

export const db = new Dexie('litsearch');

db.version(1).stores({
  todos: '++id, title, completed, createdAt, updatedAt',
  notes: '++id, title, content, createdAt, updatedAt',
});
