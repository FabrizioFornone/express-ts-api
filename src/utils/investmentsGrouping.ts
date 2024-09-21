import { Investment } from "../models";

import { format, startOfWeek } from "date-fns";

const groupByDay = (data: { data: Investment[] }) => {
  return data.data.reduce((acc, investment) => {
    const day = format(investment.creation_date as Date, "yyyy-MM-dd");
    if (!acc[day]) {
      acc[day] = [];
    }
    acc[day].push(investment);
    return acc;
  }, {} as Record<string, Investment[]>);
};

const groupByWeek = (data: { data: Investment[] }) => {
  return data.data.reduce((acc, investment) => {
    const week = format(
      startOfWeek(investment.creation_date as Date),
      "yyyy-ww"
    );
    if (!acc[week]) {
      acc[week] = [];
    }
    acc[week].push(investment);
    return acc;
  }, {} as Record<string, Investment[]>);
};

const groupByMonth = (data: { data: Investment[] }) => {
  return data.data.reduce((acc, investment) => {
    const month = format(investment.creation_date as Date, "yyyy-MM");
    if (!acc[month]) {
      acc[month] = [];
    }
    acc[month].push(investment);
    return acc;
  }, {} as Record<string, Investment[]>);
};

const groupByYear = (data: { data: Investment[] }) => {
  return data.data.reduce((acc, investment) => {
    const year = format(investment.creation_date as Date, "yyyy");
    if (!acc[year]) {
      acc[year] = [];
    }
    acc[year].push(investment);
    return acc;
  }, {} as Record<string, Investment[]>);
};

export { groupByDay, groupByWeek, groupByMonth, groupByYear };
