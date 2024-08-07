-- Manual Command
--------------- Creating the postgis extension and altering the geocode column to geography type ---------------
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

--------------- Creating the index for the geocode column ---------------
CREATE INDEX center_address_geocode_gist_index ON center_address USING GIST (geocode);

--------------- Creating trigram index for the name column on centers table ---------------
CREATE EXTENSION pg_trgm;

CREATE INDEX center_name_trgm_idx ON center USING GIN (name gin_trgm_ops);