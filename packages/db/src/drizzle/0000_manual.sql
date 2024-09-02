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

-- Adding the name_tsv column to the center table and creating the index for the name_tsv column
-- This is used for full text search
ALTER TABLE
  center
ADD
  COLUMN name_tsv tsvector;

UPDATE
  center
SET
  name_tsv = to_tsvector('simple', name);

CREATE INDEX center_name_tsv_idx ON center USING GIN (name_tsv);

-- Adding the trigger to update the name_tsv column on insert or update of the name column
CREATE FUNCTION center_name_tsvector_trigger() RETURNS trigger AS $$
BEGIN
  NEW.name_tsv := to_tsvector('simple', NEW.name);
  RETURN NEW;
END
$$ LANGUAGE plpgsql;

CREATE TRIGGER name_tsvector_update BEFORE INSERT OR UPDATE OF name
ON center FOR EACH ROW EXECUTE FUNCTION center_name_tsvector_trigger();