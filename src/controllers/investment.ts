import { Request, Response } from "express";
import * as yup from "yup";
import { fromUnixTime } from "date-fns";
import {
  validateFields,
  convertToObject,
  groupByDay,
  groupByWeek,
  groupByMonth,
  groupByYear,
} from "../utils";
import { ErrorResponse, SuccessResponse, SanitizedInvestment } from "../types";
import {
  getInvestmentsService,
  doInvestmentService,
  getInvestmentsMetricsService,
} from "../services";
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

export const getInvestmentsMetricsController = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { from, to } = req.params;
  const { groupBy } = req.query;

  const dateSchema = yup
    .object()
    .shape({
      from: yup.string().required("from date is required"),
      to: yup.string().required("to date is required"),
    })
    .test(
      "is-valid-range",
      "The to date must be greater than or equal to the from date",
      function (value) {
        const { from, to } = value;
        return parseInt(to) >= parseInt(from);
      }
    );

  const validationResponse = await validateFields(dateSchema, { from, to });

  if (validationResponse?.result) {
    return res.status(400).json(convertToObject(validationResponse));
  }

  const fromDate = fromUnixTime(parseInt(from));
  const toDate = fromUnixTime(parseInt(to));

  const result = await getInvestmentsMetricsService(fromDate, toDate);

  if (result.error) {
    const { code, errorMessage } = result as ErrorResponse;
    return res.status(code).json({ error: errorMessage });
  }

  const { data, code } = result as SuccessResponse<{ data: Investment[] }>;

  let groupedData;
  switch (groupBy) {
    case "day":
      groupedData = groupByDay(data);
      break;
    case "week":
      groupedData = groupByWeek(data);
      break;
    case "month":
      groupedData = groupByMonth(data);
      break;
    case "year":
      groupedData = groupByYear(data);
      break;
    default:
      groupedData = groupByMonth(data);
  }

  return res.status(code).json(groupedData);
};
