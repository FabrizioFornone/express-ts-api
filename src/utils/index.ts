import * as _ from "lodash";
import { validateFields } from "./validation";
import {
  groupByDay,
  groupByWeek,
  groupByMonth,
  groupByYear,
} from "./investmentsGrouping";

export const convertToObject = (data: any) => {
  return _.isString(data) ? { error: data } : data;
};

export { validateFields, groupByDay, groupByWeek, groupByMonth, groupByYear };
