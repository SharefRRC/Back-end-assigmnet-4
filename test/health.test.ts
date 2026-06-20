import request from "supertest";
import app from "../src/app";

describe("GET /api/v1/health", () => {
  it("returns 200 for public health route", async () => {
    const response = await request(app).get("/api/v1/health");
    expect(response.status).toBe(200);
  });
});