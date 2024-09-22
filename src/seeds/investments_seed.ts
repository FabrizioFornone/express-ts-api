import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  await knex("investments").insert([
    {
      investment_id: 1,
      creation_date: "2024-01-01",
      confirmation_date: "2024-01-02",
      value: 1000.0,
      annual_rate: 5.0,
    },
    {
      investment_id: 2,
      creation_date: "2024-02-01",
      confirmation_date: "2024-02-02",
      value: 2000.0,
      annual_rate: 6.0,
    },
    {
      investment_id: 3,
      creation_date: "2024-03-01",
      confirmation_date: "2024-03-02",
      value: 3000.0,
      annual_rate: 7.0,
    },
  ]);
}
