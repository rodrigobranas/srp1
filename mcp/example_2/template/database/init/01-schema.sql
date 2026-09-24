CREATE TABLE IF NOT EXISTS airlines (
  id SERIAL PRIMARY KEY,
  code VARCHAR(10) NOT NULL UNIQUE,
  name VARCHAR(120) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS aircraft (
  id SERIAL PRIMARY KEY,
  registration VARCHAR(20) NOT NULL UNIQUE,
  model VARCHAR(80) NOT NULL,
  total_seats INTEGER NOT NULL CHECK (total_seats > 0),
  airline_id INTEGER NOT NULL REFERENCES airlines(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS flights (
  id BIGSERIAL PRIMARY KEY,
  flight_number VARCHAR(20) NOT NULL,
  airline_id INTEGER NOT NULL REFERENCES airlines(id),
  aircraft_id INTEGER NOT NULL REFERENCES aircraft(id),
  origin_code CHAR(3) NOT NULL,
  destination_code CHAR(3) NOT NULL,
  departure_date DATE NOT NULL,
  departure_time TIME NOT NULL,
  arrival_time TIME NOT NULL,
  duration_minutes INTEGER NOT NULL CHECK (duration_minutes > 0),
  price NUMERIC(10, 2) NOT NULL CHECK (price > 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT flights_different_airports CHECK (origin_code <> destination_code),
  CONSTRAINT flights_unique_schedule UNIQUE (flight_number, departure_date)
);

CREATE INDEX IF NOT EXISTS flights_search_idx
  ON flights (origin_code, destination_code, departure_date, departure_time);
