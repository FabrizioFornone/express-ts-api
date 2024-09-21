import { Router } from "express";
import { registerController } from "../controllers";

const userRouter = Router();

userRouter.post("/register", registerController);

export { userRouter };
