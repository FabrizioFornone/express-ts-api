import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  await knex("authorization_tokens").insert([
    {
      token: "token1",
      access_level: "read",
      used: false,
    },
    {
      token: "token2",
      access_level: "read_write",
      used: false,
    },
    {
      token: "token3",
      access_level: "read",
      used: false,
    },
  ]);
}
