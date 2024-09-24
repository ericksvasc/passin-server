import {
  env
} from "./chunk-7EYUGQRM.mjs";
import {
  schema_exports
} from "./chunk-DFLSFB27.mjs";

// src/db/index.ts
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
var client = postgres(env.DATABASE_URL);
var db = drizzle(client, { schema: schema_exports, logger: true });

export {
  client,
  db
};
