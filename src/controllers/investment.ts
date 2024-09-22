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
import { PeriodGroupBy } from "../types/enums";

/**
 * @swagger
 * /investment:
 *   get:
 *     summary: Get all investments
 *     tags: [Investments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of investments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   investment_id:
 *                     type: integer
 *                   creation_date:
 *                     type: string
 *                     format: date-time
 *                   confirmation_date:
 *                     type: string
 *                     format: date-time
 *                     nullable: true
 *                   value:
 *                     type: number
 *                     format: float
 *                   annual_rate:
 *                     type: number
 *                     format: float
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *                   updated_at:
 *                     type: string
 *                     format: date-time
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
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

/**
 * @swagger
 * /investment:
 *   post:
 *     summary: Create a new investment
 *     tags: [Investments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - value
 *               - annual_rate
 *             properties:
 *               value:
 *                 type: string
 *                 example: "1000"
 *               annual_rate:
 *                 type: string
 *                 example: "5.5"
 *     responses:
 *       201:
 *         description: Investment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 value:
 *                   type: string
 *                 annual_rate:
 *                   type: string
 *                 creation_date:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
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

/**
 * @swagger
 * /investment/metrics/{from}/{to}:
 *   get:
 *     summary: Get investment metrics
 *     tags: [Investments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: from
 *         schema:
 *           type: string
 *         required: true
 *         description: Start date in Unix time
 *       - in: path
 *         name: to
 *         schema:
 *           type: string
 *         required: true
 *         description: End date in Unix time
 *       - in: query
 *         name: groupBy
 *         schema:
 *           type: string
 *           enum: [day, week, month, year]
 *         required: false
 *         description: Group by period
 *     responses:
 *       200:
 *         description: Investment metrics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
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
    case PeriodGroupBy.DAY:
      groupedData = groupByDay(data);
      break;
    case PeriodGroupBy.WEEK:
      groupedData = groupByWeek(data);
      break;
    case PeriodGroupBy.MONTH:
      groupedData = groupByMonth(data);
      break;
    case PeriodGroupBy.YEAR:
      groupedData = groupByYear(data);
      break;
    default:
      groupedData = groupByMonth(data);
  }

  return res.status(code).json(groupedData);
};
