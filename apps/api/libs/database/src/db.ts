// apps/api/libs/database/src/db.ts
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { config } from "dotenv";
import { mergedSchemas } from "./schemas/merged-schemas";

config({ path: ".env" }); // Load environment variables

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(pool, { schema: mergedSchemas });
