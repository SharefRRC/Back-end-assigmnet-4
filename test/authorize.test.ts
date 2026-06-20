import { authorize } from "../src/api/v1/middleware/authorize";

describe("authorize middleware", () => {
  it("should return ROLE_NOT_FOUND when user role is missing", () => {
    const middleware = authorize(["admin"]);
    const req: any = {};
    const json = jest.fn();
    const status = jest.fn().mockReturnValue({ json });
    const res: any = {
      locals: { user: {} },
      status
    };
    const next = jest.fn();

    middleware(req, res, next);

    expect(status).toHaveBeenCalledWith(403);
    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        error: expect.objectContaining({
          code: "ROLE_NOT_FOUND"
        })
      })
    );
    expect(next).not.toHaveBeenCalled();
  });

  it("should return INSUFFICIENT_ROLE when user role is not allowed", () => {
    const middleware = authorize(["admin"]);
    const req: any = {};
    const json = jest.fn();
    const status = jest.fn().mockReturnValue({ json });
    const res: any = {
      locals: { user: { role: "manager" } },
      status
    };
    const next = jest.fn();

    middleware(req, res, next);

    expect(status).toHaveBeenCalledWith(403);
    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        error: expect.objectContaining({
          code: "INSUFFICIENT_ROLE"
        })
      })
    );
    expect(next).not.toHaveBeenCalled();
  });

  it("should call next when user role is allowed", () => {
    const middleware = authorize(["manager", "admin"]);
    const req: any = {};
    const json = jest.fn();
    const status = jest.fn().mockReturnValue({ json });
    const res: any = {
      locals: { user: { role: "manager" } },
      status
    };
    const next = jest.fn();

    middleware(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(status).not.toHaveBeenCalled();
  });
});