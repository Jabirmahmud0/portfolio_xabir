import { readFile } from "node:fs/promises";
import { neon } from "@neondatabase/serverless";

const migrationUrl = process.env.MIGRATION_DATABASE_URL || process.env.DATABASE_URL;
if (!migrationUrl) throw new Error("Set MIGRATION_DATABASE_URL or DATABASE_URL before running migrations.");
const sql = neon(migrationUrl);
const source = await readFile(new URL("../db/schema.sql", import.meta.url), "utf8");
const statements = source.split("-- statement-breakpoint").map((statement) => statement.trim()).filter(Boolean);
for (const statement of statements) await sql.query(statement);
console.log(`Applied ${statements.length} schema statements.`);
