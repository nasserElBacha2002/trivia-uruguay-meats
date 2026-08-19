import path from "node:path";
import { app } from "electron";

export type DesktopPaths = {
  userData: string;
  databasePath: string;
  logsPath: string;
  frontendDistPath: string;
  backendDistDir: string;
};

function resolveDataRoot(): { userData: string; dataDir: string; logsPath: string } {
  const portableDir = process.env.PORTABLE_EXECUTABLE_DIR;
  if (portableDir) {
    return {
      userData: portableDir,
      dataDir: path.join(portableDir, "data"),
      logsPath: path.join(portableDir, "logs"),
    };
  }
  const userData = app.getPath("userData");
  return {
    userData,
    dataDir: path.join(userData, "data"),
    logsPath: path.join(userData, "logs"),
  };
}

export function getDesktopPaths(projectRoot: string): DesktopPaths {
  const { userData, dataDir, logsPath } = resolveDataRoot();
  return {
    userData,
    databasePath: path.join(dataDir, "trivia.db"),
    logsPath,
    frontendDistPath: path.join(projectRoot, "dist"),
    backendDistDir: path.join(projectRoot, "backend", "dist"),
  };
}
