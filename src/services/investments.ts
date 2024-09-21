import { Investment } from "../models";
import { ErrorResponse, SuccessResponse, SanitizedInvestment } from "../types";

export const getInvestmentsService = async (): Promise<
  SuccessResponse<{ data: Investment[] }> | ErrorResponse
> => {
  try {
    const investments = await Investment.findAll();

    return {
      code: 200,
      data: { data: investments },
    };
  } catch (error: unknown) {
    console.error("Error getting investments", error);
    return {
      error: true,
      code: 500,
      errorMessage: "Internal server error",
    };
  }
};

export const doInvestmentService = async (
  value: string,
  annual_rate: string
): Promise<SuccessResponse<{ data: SanitizedInvestment }> | ErrorResponse> => {
  try {
    console.log("value", value);
    console.log("parseFloat(value)", parseFloat(value));
    console.log(
      "Number(parseFloat(value).toFixed(2))",
      Number(parseFloat(value).toFixed(2))
    );
    const investment = await Investment.create({
      value: parseFloat(value),
      annual_rate: parseFloat(annual_rate),
      creation_date: new Date(),
    });

    const sanitizedInvestiment: SanitizedInvestment = {
      value: investment.value.toFixed(2),
      annual_rate: investment.annual_rate.toFixed(2),
    };

    return {
      code: 201,
      data: { data: sanitizedInvestiment },
    };
  } catch (error: unknown) {
    console.error("Error creating investment", error);
    return {
      error: true,
      code: 500,
      errorMessage: "Error creating investment",
    };
  }
};
