import fs from "fs";
import path from "path";

export const ensureLogsDir = () => {
  const logsDir = path.join(process.cwd(), "src", "logs");
  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
  }
  return logsDir;
};