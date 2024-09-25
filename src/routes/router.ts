import express from "express";
import { userRouter } from "./userRouter";
import { investmentRouter } from "./investmentRouter";

export const router = express.Router();

// user routes collection
router.use("/users", userRouter);

// investment routes collection
router.use("/investments", investmentRouter);
