import express from "express";
import cors from "cors";
import morgan from "morgan";
import fs from "fs";
import path from "path";

import healthRoutes from "./api/v1/routes/health.routes";
import loansRoutes from "./api/v1/routes/loans.routes";

import { ensureLogsDir } from "./api/v1/utils/logger";
import { notFoundHandler } from "./api/v1/middleware/not-found";
import { errorHandler } from "./api/v1/middleware/error-handler";

const app = express();

const logsDir = ensureLogsDir();

const accessLogStream = fs.createWriteStream(
  path.join(logsDir, "access.log"),
  { flags: "a" }
);

app.use(cors());
app.use(express.json());

app.use(morgan("dev"));
app.use(morgan("combined", { stream: accessLogStream }));

app.use("/api/v1", healthRoutes);
app.use("/api/v1", loansRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;