import Database from "better-sqlite3";

/** Opened SQLite database instance (better-sqlite3). */
export type SqliteDatabase = InstanceType<typeof Database>;
