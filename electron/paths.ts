import path from "node:path";
import { app } from "electron";

export type DesktopPaths = {
  userData: string;
  databasePath: string;
  logsPath: string;
  frontendDistPath: string;
  backendDistDir: string;
};

export function getDesktopPaths(projectRoot: string): DesktopPaths {
  const userData = app.getPath("userData");
  return {
    userData,
    databasePath: path.join(userData, "data", "trivia.db"),
    logsPath: path.join(userData, "logs"),
    frontendDistPath: path.join(projectRoot, "dist"),
    backendDistDir: path.join(projectRoot, "backend", "dist"),
  };
}
