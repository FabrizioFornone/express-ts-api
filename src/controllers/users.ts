import { Request, Response } from "express";

import { validateFields, convertToObject } from "../utils";
import { registerService, tokenService } from "../services";
import { ErrorResponse, SuccessResponse } from "../types";

import * as yup from "yup";

/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: johndoe
 *               password:
 *                 type: string
 *                 format: password
 *                 example: Password123!
 *     responses:
 *       201:
 *         description: User registered successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 username:
 *                   type: string
 *                   example: johndoe
 *       400:
 *         description: Bad request. Validation error for the input fields.
 *       409:
 *         description: Username already exists.
 *       500:
 *         description: Internal server error.
 */
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

/**
 * @swagger
 * /users/token:
 *   post:
 *     summary: Generate a token for a user
 *     tags: [Users]
 *     security:
 *       - basicAuth: []
 *     responses:
 *       201:
 *         description: Token generated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: abc123token
 *       401:
 *         description: Invalid credentials.
 *       500:
 *         description: Internal server error.
 */
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
