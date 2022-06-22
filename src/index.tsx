import React from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import 'maplibre-gl/dist/maplibre-gl.css';
import "./index.css";
import { App } from "./App/App";
import { Map } from "./Map/Map";

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const root = createRoot(document.getElementById("root")!);
root.render((
  <HashRouter>
    <Routes>
      <Route path="/" element={<App />}>
        <Route index element={<Navigate replace to="/mbtiles" />} />
        <Route path=":demo" element={<Map />} />
      </Route>
    </Routes>
  </HashRouter>
));
