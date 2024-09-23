import { Router } from "express";
import { authRead, authReadWrite } from "../middlewares";
import {
  getInvestmentsController,
  doInvestmentController,
  getInvestmentsMetricsController,
} from "../controllers";

const investmentRouter = Router();

investmentRouter.get("/", authRead, getInvestmentsController);
investmentRouter.post("/", authReadWrite, doInvestmentController);
investmentRouter.get(
  "/metrics",
  authRead,
  getInvestmentsMetricsController
);

export { investmentRouter };
