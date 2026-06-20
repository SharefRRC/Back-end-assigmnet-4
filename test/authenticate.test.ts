import { authenticate } from "../src/api/v1/middleware/authenticate";

jest.mock("../src/config/firebase", () => ({
  auth: {
    verifyIdToken: jest.fn()
  }
}));

describe("authenticate middleware", () => {
  it("returns TOKEN_NOT_FOUND when header is missing", async () => {
    const req: any = { headers: {} };
    const res: any = { locals: {} };
    const next = jest.fn();

    await authenticate(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(next.mock.calls[0][0].code).toBe("TOKEN_NOT_FOUND");
  });
});