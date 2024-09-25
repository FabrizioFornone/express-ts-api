import request from "supertest";
import app from "../app";
import { databaseConnection } from "../config/database";
import knex from "knex";
import knexConfig from "../../knexfile";

const db = knex(knexConfig.development);

beforeAll(async () => {
  await databaseConnection();
  await db.migrate.latest();
  await db.seed.run();
}, 10000);

afterAll(async () => {
  await db.migrate.rollback();
  await db.destroy();
}, 10000);

// Just a couple examples of tests that could be implemented on the endpoints

describe("Endpoints", () => {
  it("should register a new user", async () => {
    const res = await request(app).post("/api/users/register").send({
      username: "testuserr@gmail.com",
      password: "password123",
    });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("username");
  });

  it("should return error username already exists", async () => {
    const res = await request(app).post("/api/users/register").send({
      username: "testuserr@gmail.com",
      password: "password123",
    });
    expect(res.statusCode).toEqual(409);
  });

  it("should return a read_write token for valid credentials", async () => {
    const res = await request(app)
      .post("/api/users/token")
      .set(
        "Authorization",
        "Basic " +
          Buffer.from("testuserr@gmail.com:password123").toString("base64")
      );
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("token");
  });

  it("should return an error for invalid credentials", async () => {
    const res = await request(app)
      .post("/api/users/token")
      .set(
        "Authorization",
        "Basic " +
          Buffer.from("wrongtestuserr@gmail.com:wrongpassword123").toString(
            "base64"
          )
      );
    expect(res.statusCode).toEqual(401);
  });

  it("should return a read token for valid credentials", async () => {
    const res = await request(app).post("/api/users/token");
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("token");
  });

  it("should get all investments", async () => {
    const res = await request(app)
      .get("/api/investments")
      .set("Authorization", "Bearer read_token1");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("data");
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  it("should return an error 401: Invalid token", async () => {
    const res = await request(app)
      .get("/api/investments")
      .set("Authorization", "Bearer wrongtoken");
    expect(res.statusCode).toEqual(401);
  });

  it("should return an error 403: Token already used", async () => {
    const res = await request(app)
      .get("/api/investments")
      .set("Authorization", "Bearer read_token1");
    expect(res.statusCode).toEqual(403);
  });

  it("should create a new investment", async () => {
    const res = await request(app)
      .post("/api/investments")
      .set("Authorization", "Bearer read_write_token2")
      .send({
        value: "5000",
        annual_rate: "5.5",
        creation_date: "1727253312",
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("data");
    expect(res.body.data).toHaveProperty("value");
    expect(res.body.data).toHaveProperty("annual_rate");
    expect(res.body.data).toHaveProperty("creation_date");
  });

  it("should return an error for validation", async () => {
    const res = await request(app)
      .post("/api/investments")
      .set("Authorization", "Bearer read_write_token4")
      .send({
        annual_wrong_prop: "2.1",
        creation_wrongProp: "5427253312",
      });
    expect(res.statusCode).toEqual(400);
  });

  it("should get investment metrics", async () => {
    const from = Math.floor(new Date("2024-01-01").getTime() / 1000);
    const to = Math.floor(new Date("2024-12-31").getTime() / 1000);
    const res = await request(app)
      .get(`/api/investments/metrics/?from=${from}&to=${to}&groupBy=month`)
      .set("Authorization", "Bearer read_token3");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Object);
  });

  it("should return an error for validation: the to date must be >= to the from date", async () => {
    const to = Math.floor(new Date("2024-01-01").getTime() / 1000);
    const from = Math.floor(new Date("2024-12-31").getTime() / 1000);
    const res = await request(app)
      .get(`/api/investments/metrics/?from=${from}&to=${to}&groupBy=month`)
      .set("Authorization", "Bearer read_token5");
    expect(res.statusCode).toEqual(400);
  });
});
