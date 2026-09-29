import 'dotenv/config';
import pgPromise from 'pg-promise';

const pgp = pgPromise({
  capSQL: true,
});

const databaseUrl = process.env.DATABASE_URL;

export const db = databaseUrl
  ? pgp(databaseUrl)
  : pgp({
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT || 5432),
      database: process.env.DB_NAME || 'flights',
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      max: 10,
    });

export { pgp };
