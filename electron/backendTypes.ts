export type DesktopAdminConfig = {
  username: string;
  password: string;
  secureCookie: boolean;
};

export type CreateAppOptions = {
  databasePath: string;
  admin: DesktopAdminConfig;
  corsOrigin?: string;
  serveFrontendDistPath?: string;
};

export type AppRuntime = {
  app: {
    listen(port: number, hostname: string, listeningListener?: () => void): import("node:http").Server;
  };
  close: () => void;
};
