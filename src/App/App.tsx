import { FC } from "react";
import { Outlet, Link } from "react-router-dom";

export const App: FC = () => {
  return (
    <div>
      <div className="app-description">
        <h1 className="app-title">Geolife Demo</h1>
        <nav className="app-nav">
          <Link className="app-nav_link" to="/pmtiles">PMTiles (17m)</Link>
          <Link className="app-nav_link" to="/mbtiles">MBTiles (17m)</Link>
          <Link className="app-nav_link" to="/geojson?limit=1000000">GeoJSON (1m)</Link>
          <Link className="app-nav_link" to="/geojson?limit=500000">GeoJSON (0.5m)</Link>
        </nav>
      </div>
      <Outlet />
    </div>
  );
};
