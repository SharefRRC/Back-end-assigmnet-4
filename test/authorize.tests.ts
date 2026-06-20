import { authorize } from "../src/api/v1/middleware/authorize";

describe("authorize middleware", () => {
  it("returns INSUFFICIENT_ROLE when role is not allowed", () => {
    const middleware = authorize(["admin"]);
    const req: any = {};
    const res: any = { locals: { user: { role: "manager" } } };
    const next = jest.fn();

    middleware(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(next.mock.calls[0][0].code).toBe("INSUFFICIENT_ROLE");
  });
});