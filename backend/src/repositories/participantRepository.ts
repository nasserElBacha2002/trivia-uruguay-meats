import type { CreateParticipantBody } from "../types/api.js";
import type { SqliteDatabase } from "../types/db.js";

export function insertParticipant(db: SqliteDatabase, body: CreateParticipantBody): number {
  const stmt = db.prepare(`
    INSERT INTO participants (name, email, country, sector_id, buys_uruguay_meat, language)
    VALUES (@name, @email, @country, @sector_id, @buys_uruguay_meat, @language)
  `);
  const result = stmt.run({
    name: body.name.trim(),
    email: body.email.trim(),
    country: body.country.trim(),
    sector_id: body.sectorId.trim(),
    buys_uruguay_meat: body.buysUruguayMeat ? 1 : 0,
    language: body.language,
  });
  return Number(result.lastInsertRowid);
}
