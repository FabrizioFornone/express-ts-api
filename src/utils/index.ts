import * as _ from "lodash";
import { validateFields } from "./validation";
import { groupInvestmentsMetricsByPeriod } from "./investmentsMetrics";

export const convertToObject = (data: any) => {
  return _.isString(data) ? { error: data } : data;
};

export { validateFields, groupInvestmentsMetricsByPeriod };
