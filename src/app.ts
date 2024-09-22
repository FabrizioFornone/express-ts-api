import express, { Express } from "express";
import { router } from "./routes/router";

const app: Express = express();

app.use(express.json());

//routes
app.use("/api", router);

export default app;
