import { HTTP_STATUS } from "../../../constants/http-status";
import { AppError } from "./app-error";

export class ValidationError extends AppError {
  constructor(message: string, code: string) {
    super(message, HTTP_STATUS.BAD_REQUEST, code);
  }
}