import { Request, Response } from "express";

import { validateFields, convertToObject } from "../utils";
import { registerService, tokenService } from "../services";
import { ErrorResponse, SuccessResponse } from "../types";

import * as yup from "yup";

export const registerController = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { body } = req;

  const registerSchema = yup.object().shape({
    username: yup.string().required("Username is required"),
    password: yup
      .string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters"),
  });

  const validationResponse = await validateFields(registerSchema, body);

  if (validationResponse?.result) {
    return res.status(400).json(convertToObject(validationResponse));
  }

  const { username, password }: { username: string; password: string } = body;

  const result = await registerService(username, password);

  if (result.error) {
    const { code, errorMessage } = result as ErrorResponse;
    return res.status(code).json({ error: errorMessage });
  }

  const { data, code } = result as SuccessResponse<{ username: string }>;
  return res.status(code).json(data);
};

export const tokenController = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { headers } = req;

  let username: string | undefined;
  let password: string | undefined;

  if (headers && headers.authorization) {
    const base64Credentials = headers.authorization.split(" ")[1];

    const credentials = Buffer.from(base64Credentials, "base64").toString(
      "ascii"
    );

    [username, password] = credentials.split(":");
  }

  const result = await tokenService(username, password);

  if (result.error) {
    const { code, errorMessage } = result as ErrorResponse;
    return res.status(code).json({ error: errorMessage });
  }

  const { data, code } = result as SuccessResponse<{ token: string }>;
  return res.status(code).json(data);
};
