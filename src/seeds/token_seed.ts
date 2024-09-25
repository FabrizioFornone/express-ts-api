import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  await knex("authorization_tokens").insert([
    {
      token: "read_token1",
      access_level: "read",
      used: false,
    },
    {
      token: "read_write_token2",
      access_level: "read_write",
      used: false,
    },
    {
      token: "read_token3",
      access_level: "read",
      used: false,
    },
    {
      token: "read_write_token4",
      access_level: "read_write",
      used: false,
    },
    {
      token: "read_token5",
      access_level: "read",
      used: false,
    },
  ]);
}
