TRUNCATE TABLE flights, aircraft, airlines RESTART IDENTITY CASCADE;

INSERT INTO airlines (id, code, name) VALUES
  (1, 'AZU', 'Azul Linhas Aéreas'),
  (2, 'LATAM', 'LATAM Brasil'),
  (3, 'G3', 'GOL Linhas Aéreas');

INSERT INTO aircraft (id, registration, model, total_seats, airline_id) VALUES
  (1, 'PR-AZA', 'Airbus A320neo', 174, 1),
  (2, 'PR-AZB', 'Embraer E195-E2', 136, 1),
  (3, 'PR-XMA', 'Airbus A320-200', 174, 2),
  (4, 'PR-XMB', 'Airbus A321neo', 216, 2),
  (5, 'PR-GOA', 'Boeing 737-800', 186, 3),
  (6, 'PR-GOB', 'Boeing 737 MAX 8', 186, 3);

WITH dates AS (
  SELECT generate_series('2026-06-10'::date, '2026-06-12'::date, '1 day'::interval)::date AS flight_date
),
schedules AS (
  SELECT * FROM (VALUES
    (1, '06:00'::time, '07:35'::time, 95),
    (2, '07:30'::time, '09:05'::time, 95),
    (3, '09:00'::time, '10:35'::time, 95),
    (4, '10:30'::time, '12:05'::time, 95),
    (5, '12:00'::time, '13:35'::time, 95),
    (6, '14:00'::time, '15:35'::time, 95),
    (7, '16:00'::time, '17:35'::time, 95),
    (8, '18:30'::time, '20:05'::time, 95)
  ) AS schedule(schedule_number, departure_time, arrival_time, duration_minutes)
),
routes AS (
  SELECT * FROM (VALUES
    ('FLN', 'CGH', 1),
    ('CGH', 'FLN', 1),
    ('FLN', 'GRU', 2),
    ('GRU', 'FLN', 2)
  ) AS route(origin_code, destination_code, route_number)
)
INSERT INTO flights (
  flight_number, airline_id, aircraft_id, origin_code, destination_code,
  departure_date, departure_time, arrival_time, duration_minutes, price
)
SELECT
  'BR' || r.origin_code || r.destination_code || s.schedule_number || TO_CHAR(d.flight_date, 'DD') AS flight_number,
  ((r.route_number + s.schedule_number + EXTRACT(DAY FROM d.flight_date)::integer) % 3) + 1 AS airline_id,
  ((r.route_number + s.schedule_number + EXTRACT(DAY FROM d.flight_date)::integer) % 6) + 1 AS aircraft_id,
  r.origin_code,
  r.destination_code,
  d.flight_date,
  s.departure_time,
  s.arrival_time,
  s.duration_minutes,
  CASE
    WHEN r.origin_code = 'CGH' OR r.destination_code = 'CGH' THEN
      CASE WHEN EXTRACT(HOUR FROM s.departure_time) BETWEEN 10 AND 16
        THEN 649 + (s.schedule_number * 9)
        ELSE 799 + (s.schedule_number * 17)
      END
    ELSE
      CASE WHEN EXTRACT(HOUR FROM s.departure_time) BETWEEN 10 AND 16
        THEN 289 + (s.schedule_number * 7)
        ELSE 499 + (s.schedule_number * 14)
      END
  END::numeric(10, 2) AS price
FROM dates d
CROSS JOIN schedules s
CROSS JOIN routes r
ORDER BY d.flight_date, r.route_number, s.schedule_number;

SELECT setval('airlines_id_seq', (SELECT MAX(id) FROM airlines));
SELECT setval('aircraft_id_seq', (SELECT MAX(id) FROM aircraft));
SELECT setval('flights_id_seq', (SELECT MAX(id) FROM flights));
