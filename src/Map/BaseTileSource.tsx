import { FC, useMemo } from "react";
import { Layer, LayerProps, Source, SourceProps } from "react-map-gl";

// Free tile sources see:
// https://github.com/alexurquhart/free-tiles/blob/master/tiles.json

const configs: { id: string, source: SourceProps, layer: LayerProps }[] = [
  {
    id: 'osm',
    source: {
      type: 'raster',
      tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
      tileSize: 256
    },
    layer: {
      id: 'osm',
      type: 'raster',
      paint: {},
    },
  },
  {
    id: 'osm-mapnik',
    source: {
      type: 'raster',
      tiles: [
        'http://a.tile.osm.org/{z}/{x}/{y}.png',
        'http://b.tile.osm.org/{z}/{x}/{y}.png',
        'http://c.tile.osm.org/{z}/{x}/{y}.png'
      ],
      tileSize: 256
    },
    layer: {
      id: 'osm-mapnik',
      type: 'raster',
      paint: {},
    },
  },
  {
    id: 'esri-dark-gray',
    source: {
      type: 'raster',
      tiles: ['https://services.arcgisonline.com/arcgis/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}'],
      tileSize: 256
    },
    layer: {
      id: 'esri-dark-gray',
      type: 'raster',
      paint: {},
    },
  },
  {
    id: 'cartodb-positron',
    source: {
      type: 'raster',
      tiles: [
        'http://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
        'http://b.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
        'http://c.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
      ],
      tileSize: 256
    },
    layer: {
      id: 'cartodb-positron',
      type: 'raster',
      paint: {},
    },
  },
  {
    id: 'cartodb-dark-matter',
    source: {
      type: 'raster',
      tiles: [
        'http://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
        'http://b.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
        'http://c.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
      ],
      tileSize: 256
    },
    layer: {
      id: 'cartodb-dark-matter',
      type: 'raster',
      paint: {},
    },
  },
]

export const BaseTileSource: FC<{ tileId: string }> = ({ tileId }) => {
  const config = useMemo(() => {
    return configs.find(d => d.id === tileId);
  }, [tileId]);

  if (!config) {
    return null;
  }

  return (
    <Source {...config.source} >
      <Layer {...config.layer} />
    </Source>
  )
};
