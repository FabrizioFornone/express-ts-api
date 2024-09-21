import bcrypt from "bcryptjs";
import User from "../models/user";
import { ErrorResponse, SuccessResponse } from "../types";

export const registerService = async (
  username: string,
  password: string
): Promise<SuccessResponse<{ username: string }> | ErrorResponse> => {
  try {
    const existingUser: User | null = await User.findOne({
      where: { username },
    });

    if (existingUser) {
      return {
        error: true,
        code: 409,
        errorMessage: `Username ${username} already exists`,
      };
    }

    const hashedPassword: string = await bcrypt.hash(password, 10);

    const newUser: User = await User.create({
      username,
      hashed_password: hashedPassword,
    });

    return {
      code: 201,
      data: { username: newUser.username },
    };
  } catch (error: unknown) {
    return {
      error: true,
      code: 500,
      errorMessage: "Error creating user",
    };
  }
};
