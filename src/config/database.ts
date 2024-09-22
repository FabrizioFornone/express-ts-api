import { Sequelize } from "sequelize";
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

const sequelize: Sequelize = new Sequelize(
  process.env.DB_NAME!,
  process.env.DB_USER!,
  process.env.DB_PASSWORD!,
  {
    host: process.env.DB_HOST!,
    dialect: "mysql",
    port: parseInt(process.env.DB_PORT!, 10),
    logging: console.log,
  }
);

const databaseConnection = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error: unknown) {
    console.error("Unable to connect to the database:", error);
  }
};

export { sequelize, databaseConnection };
