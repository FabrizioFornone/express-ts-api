import { Investment } from "../models";
import { format, startOfWeek } from "date-fns";
import { InvestmentsGroupedMetrics } from "../types";
import { PeriodGroupBy } from "../types/enums";

export const groupInvestmentsMetricsByPeriod = (
  data: { data: Investment[] },
  period: string
) => {
  const grouped = data.data.reduce((acc, investment) => {
    let key;
    switch (period) {
      case PeriodGroupBy.DAY:
        key = format(investment.creation_date as Date, "yyyy-MM-dd");
        break;
      case PeriodGroupBy.WEEK:
        key = format(startOfWeek(investment.creation_date as Date), "yyyy-ww");
        break;
      case PeriodGroupBy.MONTH:
        key = format(investment.creation_date as Date, "yyyy-MM");
        break;
      case PeriodGroupBy.YEAR:
        key = format(investment.creation_date as Date, "yyyy");
        break;
      default:
        key = format(investment.creation_date as Date, "yyyy-MM");
    }
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(investment);
    return acc;
  }, {} as Record<string, Investment[]>);

  return { data: grouped } as InvestmentsGroupedMetrics;
};
