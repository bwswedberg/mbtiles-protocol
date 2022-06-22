import { decompress } from "fflate";
import { INDEXDB_TILESET_METADATA_STORE, INDEXDB_TILESET_TILE_STORE, openTilesetDb, RegisterTilesetEvent, RegisterTilesetFulfilledEvent, RegisterTilesetProgressEvent, TilesetWorkerEvent } from "./mbtilesCommon";

const createTilesetWorker = () => new Worker(new URL('./mbtilesWorker.ts', import.meta.url));

interface RegisterMbtilesTilesetInput {
  tilesetId: string;
  url: string;
  onProgress: (event: RegisterTilesetProgressEvent['payload']) => void;
}

export const registerMbtilesTileset = (input: RegisterMbtilesTilesetInput) => {
  const worker = createTilesetWorker();

  const terminate = () => {
    worker.terminate();
  };

  const promise = new Promise<RegisterTilesetFulfilledEvent['payload']>((resolve, reject) => {
    worker.onerror = event => {
      terminate();
      console.error(event);
    };
    worker.onmessageerror = (event) => console.error(event);
    worker.onmessage = ((event: MessageEvent<TilesetWorkerEvent>) => {
      switch (event.data.type) {
        case 'registerTileset/progress':
          input.onProgress(event.data.payload)
          return;
        case 'registerTileset/fulfilled':
          terminate();
          resolve(event.data.payload);
          return;
        case 'registerTileset/rejected':
          terminate();
          reject(event.data.payload);
          return;
        default:
          throw new Error(`Unhandled event type ${event.data.type}`)
      }
    });
    worker.postMessage(new RegisterTilesetEvent({
      url: input.url, 
      tilesetId: input.tilesetId,
    }));
  });

  return { promise, cancel: terminate };
};

export const unregisterMbtilesTileset = async (input: { tilesetId: string }) => {
  const { tilesetId } = input;
  const db = await openTilesetDb();
  const tx = db.transaction(INDEXDB_TILESET_TILE_STORE, 'readwrite');
  const tileKeys = await tx.store.getAllKeys();
  const filterExp = new RegExp(`^${tilesetId}/`);
  await Promise.all([
    ...tileKeys.filter(d => filterExp.test(d)).map(d => tx.store.delete(d)),
    tx.done
  ]);
  await db.delete(INDEXDB_TILESET_METADATA_STORE, tilesetId as "id");
};

// Convert `y` from XYZ format to TMS format. Mbtiles reference tiles using TMS format
// See: https://github.com/mapbox/node-mbtiles/blob/master/lib/mbtiles.js#L171
const yXyzToTms = (y: number, z: number) => (1 << z) - 1 - y;

export const getTile = (url: string) => {
  const tilePath = url.split("://")[1];
  let canceled = false;
  const [tileset, z, x, y, ext] = tilePath.split(/\/|\./);
  const tileId = `${tileset}/${z}/${x}/${yXyzToTms(+y, +z)}.${ext}`;
  const promise = openTilesetDb()
    .then(db => db.get(INDEXDB_TILESET_TILE_STORE, tileId as "id"))
    .then(value => {
      const gz = value?.data
      if (!gz || canceled) {
        return;
      }
      return new Promise<Uint8Array | undefined>((resolve, reject) => {
        decompress(gz, (err, data) => {
          if (err || canceled) {
            return reject(err);
          }
          resolve(data);
        });
      });
    });
  const cancel = () => {
    canceled = true;
  };
  return { promise, cancel };
}
