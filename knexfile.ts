import Knex from "knex";
import dotenv from "dotenv";

dotenv.config();

const env = process.env.NODE_ENV;
if (env) {
  // Clear existing environment variables
  delete process.env.DB_NAME;
  delete process.env.DB_USER;
  delete process.env.DB_PASSWORD;
  delete process.env.DB_HOST;
  delete process.env.DB_PORT;

  // Load environment-specific .env file
  dotenv.config({ path: `.env.${env}` });
}

export default {
  development: {
    client: "mysql2",
    connection: {
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT!, 10),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      directory: "./src/migrations",
    },
    seeds: {
      directory: "./src/seeds",
    },
  },
};
