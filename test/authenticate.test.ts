import { authenticate } from "../src/api/v1/middleware/authenticate";
import { auth } from "../src/config/firebase";

jest.mock("../src/config/firebase", () => ({
  auth: {
    verifyIdToken: jest.fn()
  }
}));

describe("authenticate middleware", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns TOKEN_NOT_FOUND when header is missing", async () => {
    const req: any = { headers: {} };
    const json = jest.fn();
    const status = jest.fn().mockReturnValue({ json });
    const res: any = { locals: {}, status };
    const next = jest.fn();

    await authenticate(req, res, next);

    expect(status).toHaveBeenCalledWith(401);
    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        error: expect.objectContaining({
          code: "TOKEN_NOT_FOUND"
        })
      })
    );
    expect(next).not.toHaveBeenCalled();
  });

  it("returns TOKEN_INVALID when token verification fails", async () => {
    (auth.verifyIdToken as jest.Mock).mockRejectedValue(new Error("bad token"));

    const req: any = {
      headers: {
        authorization: "Bearer invalid-token"
      }
    };
    const json = jest.fn();
    const status = jest.fn().mockReturnValue({ json });
    const res: any = { locals: {}, status };
    const next = jest.fn();

    await authenticate(req, res, next);

    expect(status).toHaveBeenCalledWith(401);
    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        error: expect.objectContaining({
          code: "TOKEN_INVALID"
        })
      })
    );
    expect(next).not.toHaveBeenCalled();
  });

  it("calls next and stores user when token is valid", async () => {
    (auth.verifyIdToken as jest.Mock).mockResolvedValue({
      uid: "user-123",
      email: "officer@pixell-river.com",
      role: "officer"
    });

    const req: any = {
      headers: {
        authorization: "Bearer valid-token"
      }
    };
    const json = jest.fn();
    const status = jest.fn().mockReturnValue({ json });
    const res: any = { locals: {}, status };
    const next = jest.fn();

    await authenticate(req, res, next);

    expect(res.locals.user).toEqual({
      uid: "user-123",
      email: "officer@pixell-river.com",
      role: "officer"
    });
    expect(next).toHaveBeenCalled();
  });
});