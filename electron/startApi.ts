import http from "node:http";
import path from "node:path";
import { pathToFileURL } from "node:url";
import type { AppRuntime, CreateAppOptions } from "./backendTypes.js";

export type StartedApi = {
  runtime: AppRuntime;
  server: http.Server;
  origin: string;
  port: number;
};

export async function startDesktopApi(
  options: CreateAppOptions,
  backendDistDir: string,
): Promise<StartedApi> {
  const moduleUrl = pathToFileURL(path.join(backendDistDir, "createApp.js")).href;
  const mod = (await import(moduleUrl)) as { createApp: (opts: CreateAppOptions) => AppRuntime };
  const runtime = mod.createApp(options);

  const server = await new Promise<http.Server>((resolve, reject) => {
    const httpServer = runtime.app.listen(0, "127.0.0.1", () => {
      resolve(httpServer);
    });
    httpServer.once("error", reject);
  });

  const address = server.address();
  if (!address || typeof address === "string") {
    server.close();
    runtime.close();
    throw new Error("Desktop API did not bind to a TCP port");
  }
  if (address.address !== "127.0.0.1") {
    server.close();
    runtime.close();
    throw new Error(`Refusing non-loopback bind: ${address.address}`);
  }

  return {
    runtime,
    server,
    port: address.port,
    origin: `http://127.0.0.1:${address.port}`,
  };
}

export function closeDesktopApi(started: StartedApi): Promise<void> {
  return new Promise((resolve, reject) => {
    const closeRuntime = (): void => {
      started.runtime.close();
    };

    if (!started.server.listening) {
      try {
        closeRuntime();
        resolve();
      } catch (closeErr) {
        reject(closeErr instanceof Error ? closeErr : new Error(String(closeErr)));
      }
      return;
    }

    started.server.close((err) => {
      try {
        closeRuntime();
      } catch (closeErr) {
        reject(closeErr instanceof Error ? closeErr : new Error(String(closeErr)));
        return;
      }
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });
  });
}
