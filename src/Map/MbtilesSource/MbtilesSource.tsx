import { FC, useEffect, useState } from "react";
import { Source, Layer } from "react-map-gl";
import { HeatmapLayer, CircleLayer } from "mapbox-gl";
import { registerMbtilesTileset, unregisterMbtilesTileset } from "./mbtilesService";
import { LoadingIndicator } from "../../App/LoadingIndicator";

const MAX_ZOOM_LEVEL = 12;

const heatmapLayer: HeatmapLayer = {
  id: "geolife-zip-sw--heatmap",
  "source-layer": "geolife",
  type: 'heatmap',
  maxzoom: MAX_ZOOM_LEVEL,
  paint: {
    'heatmap-weight': ['coalesce', ['get', 'point_count'], 1],
    // 'heatmap-intensity': ['interpolate', ['linear'], ['zoom'], 0, 1, MAX_ZOOM_LEVEL, 3],
    'heatmap-color': [
      'interpolate',
      ['linear'],
      ['heatmap-density'],
      0,
      'rgba(33,102,172,0)',
      0.2,
      'rgb(103,169,207)',
      0.4,
      'rgb(209,229,240)',
      0.6,
      'rgb(253,219,199)',
      0.8,
      'rgb(239,138,98)',
      0.9,
      'rgb(255,201,101)'
    ],
    'heatmap-radius': ['interpolate', ['exponential', 10], ['zoom'], 10, 30, MAX_ZOOM_LEVEL, 5],
    'heatmap-opacity': ['interpolate', ['linear'], ['zoom'], 7, 0.62, MAX_ZOOM_LEVEL, 0.1]
  }
};

const circleLayer: CircleLayer = {
  id: "geolife-zip-sw--points",
  "source-layer": "geolife",
  type: 'circle',
  minzoom: MAX_ZOOM_LEVEL,
  paint: {
    'circle-radius': 5,
  }
};


export const MbtilesSource: FC = () => {
  const [isReady, setIsReady] = useState(false);
  const [progressMessage, setProgressMessage] = useState<string | undefined>();

  useEffect(() => {
    const tilesetId = 'geolife-mbtiles';
    const { promise, cancel } = registerMbtilesTileset({
      url: `${process.env.PUBLIC_URL}/geolife-full-z14cd10.mbtiles`, 
      tilesetId,
      onProgress: event => setProgressMessage(event.message),
    });
    promise.then(() => {
        setIsReady(true);
      })
      .catch(error => {
        console.error(error);
      });
    return () => {
      cancel();
      unregisterMbtilesTileset({ tilesetId });
    };
  }, []);


  if (!isReady) {
    return (
      <LoadingIndicator message={progressMessage} />
    );
  }

  return (
    <Source
      type="vector"
      tiles={['mbtiles://geolife-mbtiles/{z}/{x}/{y}.pbf']}
      maxzoom={MAX_ZOOM_LEVEL}
    >
      <Layer {...heatmapLayer} />
      <Layer {...circleLayer} />
    </Source>
  )
};
