import { Router } from "express";
import { authRead, authReadWrite } from "../middlewares";
import { getInvestmentsController, doInvestmentController } from "../controllers";

const investmentRouter = Router();

investmentRouter.get("/", authRead, getInvestmentsController);
investmentRouter.post("/", authReadWrite, doInvestmentController);

export { investmentRouter };
