import { findFlights, FlightRecord } from '../data/flight-data';

const SUPPORTED_AIRPORTS = ['FLN', 'CGH', 'GRU'] as const;
const FIRST_DATE = '2026-06-10';
const LAST_DATE = '2026-06-12';

export type FlightSearch = {
  origin: string;
  destination: string;
  date: string;
};

export type FlightSearchResult = {
  search: FlightSearch;
  outboundFlights: FlightRecord[];
  returnFlights: FlightRecord[];
};

export type BestSameDayTripInput = {
  origin: string;
  destination: string;
  date: string;
  meetingStartTime?: string;
  meetingEndTime?: string;
  sameDay?: boolean;
};

export type FlightPair = {
  outbound: FlightRecord;
  return: FlightRecord;
  totalPrice: number;
};

export type BestSameDayTripResult = {
  search: {
    origin: string;
    destination: string;
    airportsConsidered: string[];
    date: string;
    meetingStartTime?: string;
    meetingEndTime?: string;
    sameDay: boolean;
  };
  recommendation: FlightPair;
  alternatives: FlightPair[];
  explanation: string;
};

const isValidDate = (value: string): boolean =>
  /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(`${value}T00:00:00Z`));

const isValidTime = (value: string): boolean => /^([01]\d|2[0-3]):[0-5]\d$/.test(value);

const normalizeText = (value: string): string =>
  value.trim().toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

const resolveAirport = (value: string, role: 'origin' | 'destination'): string => {
  const normalized = normalizeText(value);
  if (normalized === 'FLN' || normalized === 'FLORIANOPOLIS') return 'FLN';
  if (normalized === 'CGH' || normalized === 'CONGONHAS' || normalized === 'SAO PAULO CONGONHAS') return 'CGH';
  if (normalized === 'GRU' || normalized === 'GUARULHOS' || normalized === 'SAO PAULO GUARULHOS') return 'GRU';
  if (role === 'destination' && (normalized === 'SAO PAULO' || normalized === 'SAO PAULO SP')) return 'SAO_PAULO';
  throw new Error(`${role === 'origin' ? 'Origem' : 'Destino'} inválido. Use FLN, CGH, GRU ou São Paulo.`);
};

const resolveDestinationAirports = (destination: string): string[] => {
  const airport = resolveAirport(destination, 'destination');
  return airport === 'SAO_PAULO' ? ['CGH', 'GRU'] : [airport];
};

const validateTime = (time: string | undefined, label: string): void => {
  if (time !== undefined && !isValidTime(time)) {
    throw new Error(`${label} deve estar no formato HH:mm.`);
  }
};

const toMinutes = (time: string): number => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

export const searchFlights = async (input: FlightSearch): Promise<FlightSearchResult> => {
  const origin = input.origin.trim().toUpperCase();
  const destination = input.destination.trim().toUpperCase();
  const date = input.date.trim();

  if (!SUPPORTED_AIRPORTS.includes(origin as (typeof SUPPORTED_AIRPORTS)[number])) {
    throw new Error('Aeroporto de origem inválido. Use FLN, CGH ou GRU.');
  }

  if (!SUPPORTED_AIRPORTS.includes(destination as (typeof SUPPORTED_AIRPORTS)[number])) {
    throw new Error('Aeroporto de destino inválido. Use FLN, CGH ou GRU.');
  }

  if (origin === destination) {
    throw new Error('Origem e destino devem ser diferentes.');
  }

  if (!isValidDate(date) || date < FIRST_DATE || date > LAST_DATE) {
    throw new Error(`A data deve estar entre ${FIRST_DATE} e ${LAST_DATE}.`);
  }

  const [outboundFlights, returnFlights] = await Promise.all([
    findFlights(origin, destination, date),
    findFlights(destination, origin, date),
  ]);

  return {
    search: { origin, destination, date },
    outboundFlights,
    returnFlights,
  };
};

export const findBestSameDayTrip = async (
  input: BestSameDayTripInput,
): Promise<BestSameDayTripResult> => {
  const origin = resolveAirport(input.origin, 'origin');
  const airportsConsidered = resolveDestinationAirports(input.destination);
  const date = input.date.trim();
  const meetingStartTime = input.meetingStartTime?.trim();
  const meetingEndTime = input.meetingEndTime?.trim();
  const sameDay = input.sameDay ?? true;

  if (origin === 'SAO_PAULO') {
    throw new Error('A origem deve ser um aeroporto específico; São Paulo não pode ser usado como origem.');
  }
  if (!sameDay) {
    throw new Error('Este MCP trabalha apenas com ida e volta no mesmo dia.');
  }
  if (!isValidDate(date) || date < FIRST_DATE || date > LAST_DATE) {
    throw new Error(`A data deve estar entre ${FIRST_DATE} e ${LAST_DATE}.`);
  }
  validateTime(meetingStartTime, 'meetingStartTime');
  validateTime(meetingEndTime, 'meetingEndTime');
  if (meetingStartTime && meetingEndTime && toMinutes(meetingEndTime) <= toMinutes(meetingStartTime)) {
    throw new Error('meetingEndTime deve ser posterior a meetingStartTime.');
  }

  const searches = await Promise.all(
    airportsConsidered.map((destination) => searchFlights({ origin, destination, date })),
  );
  const pairs: FlightPair[] = searches.flatMap((search) =>
    search.outboundFlights.flatMap((outbound) =>
      search.returnFlights
        .filter((returnFlight) =>
          (!meetingStartTime || toMinutes(outbound.arrivalTime) <= toMinutes(meetingStartTime)) &&
          (!meetingEndTime || toMinutes(returnFlight.departureTime) >= toMinutes(meetingEndTime)),
        )
        .map((returnFlight) => ({
          outbound,
          return: returnFlight,
          totalPrice: Number((outbound.price + returnFlight.price).toFixed(2)),
        })),
    ),
  );

  if (pairs.length === 0) {
    throw new Error('Não encontrei uma combinação que respeite a janela da reunião.');
  }

  pairs.sort((first, second) =>
    first.totalPrice - second.totalPrice ||
    toMinutes(first.outbound.departureTime) - toMinutes(second.outbound.departureTime) ||
    toMinutes(first.return.departureTime) - toMinutes(second.return.departureTime),
  );

  const recommendation = pairs[0];
  const timeDescription = meetingStartTime && meetingEndTime
    ? `chegada até ${meetingStartTime} e retorno a partir de ${meetingEndTime}`
    : 'os horários disponíveis';

  return {
    search: {
      origin,
      destination: input.destination.trim(),
      airportsConsidered,
      date,
      ...(meetingStartTime ? { meetingStartTime } : {}),
      ...(meetingEndTime ? { meetingEndTime } : {}),
      sameDay,
    },
    recommendation,
    alternatives: pairs.slice(1, 4),
    explanation: `A melhor combinação é ${recommendation.outbound.destination} (${recommendation.outbound.flightNumber}) na ida e ${recommendation.return.origin} (${recommendation.return.flightNumber}) na volta, totalizando R$ ${recommendation.totalPrice.toFixed(2)} e respeitando ${timeDescription}.`,
  };
};
