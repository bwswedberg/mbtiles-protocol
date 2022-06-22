import * as idb from 'idb';

export const INDEXDB_TILESET_DATABASE = 'tilesets';
export const INDEXDB_TILESET_DATABASE_VERSION = 1;
export const INDEXDB_TILESET_METADATA_STORE = 'metadata';
export const INDEXDB_TILESET_TILE_STORE = 'tile';

export class RegisterTilesetEvent {
  readonly type = 'registerTileset';
  constructor (public payload: { tilesetId: string, url: string }) {}
}

export class RegisterTilesetProgressEvent {
  readonly type = 'registerTileset/progress';
  constructor (public payload: { tilesetId: string, message: string, date: string }) {}
}

export class RegisterTilesetFulfilledEvent {
  readonly type = 'registerTileset/fulfilled';
  constructor (public payload: { tilesetId: string }) {}
}

export class RegisterTilesetRejectedEvent {
  readonly type = 'registerTileset/rejected';
  constructor (public payload: { error: string }) {}
}

export class UnregisterTilesetEvent {
  readonly type = 'unregisterTileset';
  constructor (public payload: { tilesetId: string }) {}
}

export class UnregisterTilesetFulfilledEvent {
  readonly type = 'unregisterTileset/fulfilled';
  constructor (public payload: { tilesetId: string }) {}
}

export class UnregisterTilesetRejectedEvent {
  readonly type = 'unregisterTileset/rejected';
  constructor (public payload: { error: string }) {}
}

export type TilesetWorkerEvent = 
  | RegisterTilesetEvent
  | RegisterTilesetProgressEvent
  | RegisterTilesetFulfilledEvent
  | RegisterTilesetRejectedEvent
  | UnregisterTilesetEvent
  | UnregisterTilesetFulfilledEvent
  | UnregisterTilesetRejectedEvent;

export interface IndexdbTilesetDatabaseSchema extends idb.DBSchema {
  metadata: {
    key: 'id',
    value: { id: string; date: string; }
  };
  tile: {
    key: 'id',
    value: { id: string; data: Uint8Array; } 
  };
}

export type IndexdbTilesetDatabase = idb.IDBPDatabase<IndexdbTilesetDatabaseSchema>;

export const openTilesetDb = async () => {
  const db = await idb.openDB<IndexdbTilesetDatabaseSchema>(
    INDEXDB_TILESET_DATABASE, 
    INDEXDB_TILESET_DATABASE_VERSION, 
    {
      upgrade: db => {
        db.createObjectStore(INDEXDB_TILESET_METADATA_STORE, {
          keyPath: 'id',
        });
        db.createObjectStore(INDEXDB_TILESET_TILE_STORE, {
          keyPath: 'id',
        });
      }
    }
  );
  return db;
};
