import express from "express";
import { userRouter } from "./userRouter";
import { investmentRouter } from "./investmentRouter";

// import { authenticateToken } from "../middleware/auth";

export const router = express.Router();

// user routes collection
router.use("/user", userRouter);

// investment routes collection
router.use("/investment", investmentRouter);
