import { authorize } from "../src/api/v1/middleware/authorize";
import { ERROR_CODES } from "../src/constants/error-codes";
import { HTTP_STATUS } from "../src/constants/http-status";

describe("authorize middleware", () => {
  it("should call next with ROLE_NOT_FOUND when user role is missing", () => {
    const middleware = authorize(["admin"]);
    const req = {} as any;
    const res = {
      locals: {}
    } as any;
    const next = jest.fn();

    middleware(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);

    const error = next.mock.calls[0][0];
    expect(error).toBeDefined();
    expect(error.message).toBe("Forbidden: Role not found");
    expect(error.code).toBe(ERROR_CODES.ROLE_NOT_FOUND);
    expect(error.statusCode).toBe(HTTP_STATUS.FORBIDDEN);
  });

  it("should call next with INSUFFICIENT_ROLE when user role is not allowed", () => {
    const middleware = authorize(["admin"]);
    const req = {} as any;
    const res = {
      locals: {
        user: {
          uid: "manager-uid",
          role: "manager"
        }
      }
    } as any;
    const next = jest.fn();

    middleware(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);

    const error = next.mock.calls[0][0];
    expect(error).toBeDefined();
    expect(error.message).toBe("Forbidden: Insufficient role");
    expect(error.code).toBe(ERROR_CODES.INSUFFICIENT_ROLE);
    expect(error.statusCode).toBe(HTTP_STATUS.FORBIDDEN);
  });

  it("should call next with no error when user role is allowed", () => {
    const middleware = authorize(["manager", "admin"]);
    const req = {} as any;
    const res = {
      locals: {
        user: {
          uid: "manager-uid",
          role: "manager"
        }
      }
    } as any;
    const next = jest.fn();

    middleware(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith();
  });
});