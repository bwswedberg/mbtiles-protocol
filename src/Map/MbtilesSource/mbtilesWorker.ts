import initSqlJs, { Database as SqlJsDatabase } from 'sql.js';
import sqlJsWasmUrl from 'sql.js/dist/sql-wasm.wasm';
import { RegisterTilesetEvent, RegisterTilesetFulfilledEvent, RegisterTilesetProgressEvent, RegisterTilesetRejectedEvent, INDEXDB_TILESET_METADATA_STORE, INDEXDB_TILESET_TILE_STORE, openTilesetDb, IndexdbTilesetDatabase, TilesetWorkerEvent } from './mbtilesCommon';

const MBTILES_PAGE_SIZE = 5000;

const getSql = () => {
  return initSqlJs({
    // Required to load the wasm binary asynchronously. Of course, you can host it wherever you want
    // You can omit locateFile completely when running in node
    locateFile: () => sqlJsWasmUrl
  });
};

const getMbtiles = async (url: string) => {
  const sql = await getSql();
  const data = await fetch(url).then(res => res.arrayBuffer());
  return new sql.Database(new Uint8Array(data));
};

const getTileset = async (db: IndexdbTilesetDatabase, tilesetId: string) => {
  const record = await db.get(INDEXDB_TILESET_METADATA_STORE, tilesetId as "id");
  return record;
};

const putTileset = async (db: IndexdbTilesetDatabase, tilesetId: string) => {
  await db.put(INDEXDB_TILESET_METADATA_STORE, {
    id: tilesetId,
    date: new Date().toISOString(),
  });
  const tilesets = await db.getAllKeys(INDEXDB_TILESET_METADATA_STORE);
  const tx = db.transaction(INDEXDB_TILESET_TILE_STORE, 'readwrite');
  const tileKeys = await tx.store.getAllKeys();
  const validTilesets = tilesets.filter(d => d !== tilesetId);
  const tilesetExp = new RegExp(`^(${validTilesets.join('|')})/`)
  const tileKeysToRemove = tileKeys.filter(key => !tilesetExp.test(key));
  await Promise.all([
    ...tileKeysToRemove.map(d => tx.store.delete(d)),
    tx.done
  ]);
}

const paginateMbtiles = (mbtiles: SqlJsDatabase, tilesetId: string, offset: number, limit: number)
: { id: string, data: Uint8Array }[] | undefined  => {
  // MB Tile Spec: https://github.com/mapbox/mbtiles-spec/blob/master/1.3/spec.md
  // Gets tile as gzipped Uint8Array() 
  const response = mbtiles.exec(
    "SELECT zoom_level, tile_column, tile_row, tile_data FROM tiles ORDER BY zoom_level, tile_column, tile_row LIMIT $limit OFFSET $offset",
    { $limit: limit, $offset: offset }
  );
  const values = response && response[0] && response[0].values;
  if (!values) {
    return;
  }
  return values.map(d => ({
    id: `${tilesetId}/${d[0]}/${d[1]}/${d[2]}.pbf`,
    data: d[3] as Uint8Array,
  }));
}

const putTiles = async ( 
  db: IndexdbTilesetDatabase, 
  tilesetId: string, 
  mbtiles: SqlJsDatabase
) => {
  // MB Tile Spec: https://github.com/mapbox/mbtiles-spec/blob/master/1.3/spec.md
  // Gets tile as gzipped Uint8Array() 
  let offset = 0;
  while (true) {
    const tiles = paginateMbtiles(mbtiles, tilesetId, offset, MBTILES_PAGE_SIZE);
    if (!tiles) {
      break;
    }
    const tx = db.transaction(INDEXDB_TILESET_TILE_STORE, 'readwrite');
    await Promise.all([
      ...tiles.map(d => tx.store.add(d)) as Promise<any>[],
      tx.done,
    ])
    offset += MBTILES_PAGE_SIZE;
  }
}

const postProgressMessage = (tilesetId: string, message: string) => {
  self.postMessage(new RegisterTilesetProgressEvent({
    tilesetId,
    message, 
    date: new Date().toISOString(),
  }));
};

const handleRegisterTileset = async (event: RegisterTilesetEvent) => {
  try {
    const { url, tilesetId } = event.payload;
    postProgressMessage(tilesetId, 'start');
    const db = await openTilesetDb();

    const tileset = await getTileset(db, tilesetId);
    if (tileset) {
      self.postMessage(new RegisterTilesetFulfilledEvent({
        tilesetId: event.payload.tilesetId,
      }));
      return 
    }
    
    // Get all the raw tileset data
    postProgressMessage(tilesetId, 'initMbtiles:begin');
    const mbtiles = await getMbtiles(url);
    postProgressMessage(tilesetId, 'initMbtiles:end')

    // Add tileset metadata and delete any prior tiles
    postProgressMessage(tilesetId, 'tilesetPut:begin')
    await putTileset(db, tilesetId);
    postProgressMessage(tilesetId, 'tilesetPut:end')

    // Add all the tiles
    postProgressMessage(tilesetId, 'tilesPut:begin')
    await putTiles(db, tilesetId, mbtiles);
    postProgressMessage(tilesetId, 'tilesPut:end')

    self.postMessage(new RegisterTilesetFulfilledEvent({
      tilesetId: event.payload.tilesetId,
    }));

  } catch (err) {
    const error = typeof err === 'string' ? err
      : err instanceof Error ? `${err.name}: ${err.message}`
      : 'Failed to register tileset';
    self.postMessage(new RegisterTilesetRejectedEvent({ error }));
  }
};

self.onmessage = (event: MessageEvent<TilesetWorkerEvent>) => {
  switch (event.data.type) {
    case 'registerTileset':
      return handleRegisterTileset(event.data);
    default:
      throw new Error('Unhandled event type')
  }
}
