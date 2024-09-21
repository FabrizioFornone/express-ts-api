import express from "express";
import { userRouter } from "./userRouter";

// import { authenticateToken } from "../middleware/auth";

export const router = express.Router();

// user routes collection
router.use("/user", userRouter);
