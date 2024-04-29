-- Manual Command
CREATE EXTENSION IF NOT EXISTS postgis;

ALTER TABLE
  center_address
ALTER COLUMN
  geocode
SET
  DATA TYPE geography(Point, 4326) USING ST_SetSRID(
    ST_MakePoint(
      (geocode ->> 'longitude') :: float,
      (geocode ->> 'latitude') :: float
    ),
    4326
  ) :: geography;