import { Cancelable, RequestParameters, ResponseCallback } from "maplibre-gl";
import { getTile } from "./mbtilesService";

export const MBTILES_PROTOCOL = 'mbtiles';

export const mbtilesProtocol = (params: RequestParameters, cb: ResponseCallback<any>): Cancelable => {
  const { promise, cancel } = getTile(params.url);
  promise.then(data => {
      if (!data) {
        return cb(null, null);
      }
      return cb(null, data)
    })
    .catch(err => {
      const error = err instanceof Error ? err : new Error(err);
      cb(error);
    });

  return { cancel };
};