import Dexie from 'dexie';

export const db = new Dexie('litsearch');

db.version(1).stores({
  todos: '++id, title, completed, todolistId, apiId, createdAt, updatedAt',
  todolists: '++id, title, createdAt, updatedAt',
  notes: '++id, title, content, createdAt, updatedAt',
  pages: '++id, title, apiId, createdAt, updatedAt',
  blocks: '++id, pageId, apiId, content, type, order, tableData, createdAt, updatedAt',
});

export const dbReady = db.open();
