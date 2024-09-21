import { Request, Response } from "express";

import { validateFields, convertToObject } from "../utils";
import { registerService } from "../services";
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
