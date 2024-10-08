import app from "./app";
import dotenv from "dotenv";
import { databaseConnection } from "./config/database";

dotenv.config();

const port = process.env.PORT || 3000;

const start = async (): Promise<void> => {
  try {
    await databaseConnection();
    app.listen(port, () => {
      console.log(`[server]: Server is running at http://localhost:${port}`);
    });
  } catch (error: unknown) {
    console.error(error);
    process.exit(1);
  }
};

void start();
