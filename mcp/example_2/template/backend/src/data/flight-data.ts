import { db } from '../config/database';

export type FlightRecord = {
  id: number;
  flightNumber: string;
  origin: string;
  destination: string;
  date: string;
  departureTime: string;
  arrivalTime: string;
  durationMinutes: number;
  price: number;
  airline: {
    code: string;
    name: string;
  };
  aircraft: {
    registration: string;
    model: string;
  };
};

type FlightRow = {
  id: number;
  flight_number: string;
  origin_code: string;
  destination_code: string;
  departure_date: string;
  departure_time: string;
  arrival_time: string;
  duration_minutes: number;
  price: string;
  airline_code: string;
  airline_name: string;
  aircraft_registration: string;
  aircraft_model: string;
};

const flightFields = `
  f.id::integer AS id,
  f.flight_number,
  f.origin_code,
  f.destination_code,
  to_char(f.departure_date, 'YYYY-MM-DD') AS departure_date,
  to_char(f.departure_time, 'HH24:MI') AS departure_time,
  to_char(f.arrival_time, 'HH24:MI') AS arrival_time,
  f.duration_minutes,
  f.price,
  al.code AS airline_code,
  al.name AS airline_name,
  ac.registration AS aircraft_registration,
  ac.model AS aircraft_model
`;

const mapFlight = (row: FlightRow): FlightRecord => ({
  id: row.id,
  flightNumber: row.flight_number,
  origin: row.origin_code,
  destination: row.destination_code,
  date: row.departure_date,
  departureTime: row.departure_time,
  arrivalTime: row.arrival_time,
  durationMinutes: row.duration_minutes,
  price: Number(row.price),
  airline: {
    code: row.airline_code,
    name: row.airline_name,
  },
  aircraft: {
    registration: row.aircraft_registration,
    model: row.aircraft_model,
  },
});

export const findFlights = async (
  origin: string,
  destination: string,
  date: string,
): Promise<FlightRecord[]> => {
  const rows = await db.any<FlightRow>(
    `
      SELECT ${flightFields}
      FROM flights f
      JOIN airlines al ON al.id = f.airline_id
      JOIN aircraft ac ON ac.id = f.aircraft_id
      WHERE f.origin_code = $1
        AND f.destination_code = $2
        AND f.departure_date = $3::date
      ORDER BY f.departure_time, f.price
    `,
    [origin, destination, date],
  );

  return rows.map(mapFlight);
};

export const checkDatabase = async (): Promise<void> => {
  await db.one('SELECT 1 AS connected');
};
