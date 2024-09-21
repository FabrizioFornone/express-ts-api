import { Router } from "express";
import { registerController, tokenController } from "../controllers";

const userRouter = Router();

userRouter.post("/register", registerController);

userRouter.post("/token", tokenController);

export { userRouter };
