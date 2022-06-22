import { FC } from 'react';
import maplibregl from 'maplibre-gl';
import MapGL from 'react-map-gl';
import { useParams } from 'react-router-dom';
import { BaseTileSource } from './BaseTileSource';
import { mbtilesProtocol, MBTILES_PROTOCOL } from './MbtilesSource/mbtilesProtocol';
import { MbtilesSource } from './MbtilesSource/MbtilesSource';
import { GeojsonSource } from './GeojsonSource';

maplibregl.addProtocol(MBTILES_PROTOCOL, mbtilesProtocol);

const mapStyle = { 
  width: '100%', 
  height: '100vh',
};
const initialViewState = {
  latitude: 38,
  longitude: 118,
  zoom: 3
}

export const Map: FC = () => {
  const params = useParams<{ demo: string }>();

  return (
    <MapGL
      style={mapStyle}
      initialViewState={initialViewState}
      mapLib={maplibregl}
    >
      <BaseTileSource tileId="esri-dark-gray" />
      {params.demo === 'mbtiles' ? (
        <MbtilesSource />
      ) : params.demo === 'geojson' ? (
        <GeojsonSource />
      ) : null}
    </MapGL>
  );
}
