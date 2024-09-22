import bcrypt from "bcryptjs";
import crypto from "crypto";
import { User, Token } from "../models";
import { ErrorResponse, SuccessResponse } from "../types";
import { AccessLevel } from "../types/enums";

const createToken = async (accessLevel: string): Promise<string> => {
  const token: string = crypto.randomBytes(32).toString("hex");

  await Token.create({
    token,
    access_level: accessLevel,
    used: false,
  });

  return token;
};

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

export const tokenService = async (
  username: string | undefined,
  password: string | undefined
): Promise<SuccessResponse<{ token: string }> | ErrorResponse> => {
  if (!username || !password) {
    const token: string = await createToken(AccessLevel.READ);
    return {
      code: 201,
      data: { token },
    };
  }

  try {
    const user: User | null = await User.findOne({ where: { username } });

    if (!user) {
      return {
        error: true,
        code: 401,
        errorMessage: "Invalid credentials",
      };
    }

    const passwordMatch: boolean = await bcrypt.compare(
      password,
      user.hashed_password
    );

    if (!passwordMatch) {
      return {
        error: true,
        code: 401,
        errorMessage: "Invalid credentials",
      };
    }

    const token: string = await createToken(AccessLevel.READ_WRITE);

    return {
      code: 201,
      data: { token },
    };
  } catch (error: unknown) {
    return {
      error: true,
      code: 500,
      errorMessage: "Error logging in",
    };
  }
};
