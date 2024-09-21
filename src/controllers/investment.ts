import { Request, Response } from "express";
import * as yup from "yup";
import { validateFields, convertToObject } from "../utils";
import { ErrorResponse, SuccessResponse, SanitizedInvestment } from "../types";
import { getInvestmentsService, doInvestmentService } from "../services";
import { Investment } from "../models";

export const getInvestmentsController = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const result = await getInvestmentsService();

  if (result.error) {
    const { code, errorMessage } = result as ErrorResponse;
    return res.status(code).json({ error: errorMessage });
  }

  const { data, code } = result as SuccessResponse<{ data: Investment[] }>;
  return res.status(code).json(data);
};

export const doInvestmentController = async (
  req: Request & { username?: string },
  res: Response
) => {
  const { body } = req;

  const registerSchema = yup.object().shape({
    value: yup.string().required("value is required"),
    annual_rate: yup.string().required("annual_rate is required"),
  });

  const validationResponse = await validateFields(registerSchema, body);

  if (validationResponse?.result) {
    return res.status(400).json(convertToObject(validationResponse));
  }

  const { value, annual_rate }: { value: string; annual_rate: string } = body;

  const result = await doInvestmentService(value, annual_rate);

  if (result.error) {
    const { code, errorMessage } = result as ErrorResponse;
    return res.status(code).json({ error: errorMessage });
  }

  const { data, code } = result as SuccessResponse<{
    data: SanitizedInvestment;
  }>;
  return res.status(code).json(data);
};
