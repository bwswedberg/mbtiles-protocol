# Proof of Concept
Demonstrates mbtiles and cluster sources in the browser to show large amounts of data.

https://bwswedberg.github.io/mbtiles-protocol/

## MBTiles Source (~17m points)
Serves vector tiles from mbtiles in browser
- Web worker registers mbtiles by downloading and seeding IndexDB
- Maplibre `addProtocol` api provides hook to fetch tiles from IndexDB
- Dataset is ~50mb and the "full" geolife data set created with tippecanoe `--drop-densest-as-needed`

## GeoJSON Source (1m & 500k points)
Service geojson using source `cluster` params
- Dataset is 130mb (~9mb gzip) and decompressed in the browser
