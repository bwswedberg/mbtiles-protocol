# Alternate Vector Tile Protocol Demos
Demonstrates mbtiles and cluster sources in the browser to show large amounts of data.

https://bwswedberg.github.io/vector-tile-protocols/

## PMTiles Source (~17m points)
Serves vector tiles from (PMTiles)[https://github.com/protomaps/PMTiles]

## MBTiles Source (~17m points)
Serves vector tiles from mbtiles in browser
- Web worker registers mbtiles by downloading and seeding IndexDB
- Maplibre `addProtocol` api provides hook to fetch tiles from IndexDB
- Dataset is ~50mb and the "full" geolife data set created with tippecanoe `--drop-densest-as-needed`

### MBTiles Method A: Drop Densest as Needed
  Build mbtiles to max zoom of 12 (8ft precision). Drop densest points as needed based on max tile size and max features limits. This will results in missing points which may not be ideal.
  
  ```
  tippecanoe -f -P -z12 -l geolife --drop-densest-as-needed -o geolife-full-z12.mbtiles data/geolife-full.geojson
  ```

### MBTiles Method B: Cluster Densest as Needed
  Build mbtiles to max zoom level of 12 (8ft precision). Cluster densest points as needed based on max tile size and max features limits. This will create cluster features that will have `clustered: true` and `point_count: <number>` properties for styling.

  ```
  tippecanoe -f -P -z12 -r1 -l geolife --cluster-densest-as-needed -o geolife-full-z12cdan.mbtiles data/geolife-full.geojson
  ```

### MBTiles Method C: Cluster Densest as Needed + Aggregated cluster
  Build mbtiles and cluster. Cluster densest points as needed based on max tile size and max features limits. This will create cluster features that will have `clustered: true` and `point_count: <number>` properties for styling.

  ```
  # Build cluster layers without special accumulators
  tippecanoe -f -P -z12 -r1 -l geolife --cluster-distance=10 -o geolife-full-z12cd10.mbtiles data/geolife-full.geojson

  # Build highest zoom level with special cluster accumulators for `id` and `date` field to allow details-on-demand
  # Add flag for no tile size limit because our cluster attribute may be large
  tippecanoe -f -P -z13 -Z13 -r1 -l geolife --cluster-distance=10 --no-tile-size-limit --no-feature-limit --accumulate-attribute=id:comma --accumulate-attribute=date:comma -o geolife-full-z13cd10.mbtiles data/geolife-full.geojson

  # Join tiles 
  tile-join -f --no-tile-size-limit -o geolife-full-z12cd10-z13cd10.mbtiles geolife-full-z12cd10.mbtiles geolife-full-z13cd10.mbtiles
  ```

## GeoJSON Source (1m & 500k points)
Service geojson using source `cluster` params
- Dataset is 130mb (~9mb gzip) and decompressed in the browser
