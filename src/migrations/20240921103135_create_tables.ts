import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("users", function (table) {
    table.increments("user_id").primary();
    table.string("username").unique().notNullable();
    table.string("hashed_password").notNullable();
    table.timestamps(true, true);
  });

  await knex.schema.createTable("investments", function (table) {
    table.increments("investment_id").primary();
    table.date("creation_date").notNullable();
    table.date("confirmation_date");
    table.decimal("value", 15, 2).notNullable();
    table.decimal("annual_rate", 5, 2).notNullable();
    table.timestamps(true, true);
  });

  await knex.schema.createTable("authorization_tokens", function (table) {
    table.increments("token_id").primary();
    table.string("token").notNullable().unique();
    table.enu("access_level", ["read", "read_write"]).notNullable();
    table.boolean("used").defaultTo(false);
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("authorization_tokens");
  await knex.schema.dropTableIfExists("investments");
  await knex.schema.dropTableIfExists("users");
}
