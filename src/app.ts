import express from "express";
import cors from "cors";
import morgan from "morgan";
import healthRoutes from "./api/v1/routes/health.routes";
import loansRoutes from "./api/v1/routes/loans.routes";

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/v1", healthRoutes);
app.use("/api/v1", loansRoutes);

export default app;