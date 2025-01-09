/**
  FIXME - bu db klasörünü packages altına taşı. diğerleri supabase kullanırken bu sqlite kullanıyor. iki adet instance olacak.
*/
import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import * as schema from "./schema";
export * from "./schema";

const sqlite = new Database(process.env.DATABASE_NAME);

export const db = drizzle({ client: sqlite, schema });
