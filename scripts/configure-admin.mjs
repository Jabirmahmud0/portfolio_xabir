import { readFile, writeFile } from "node:fs/promises";
import { randomBytes, scryptSync } from "node:crypto";

const envUrl = new URL("../.env", import.meta.url);
let source = await readFile(envUrl, "utf8");

const password = randomBytes(24).toString("base64url");
const salt = randomBytes(16).toString("hex");
const passwordHash = `scrypt:${salt}:${scryptSync(password, salt, 64).toString("hex")}`;
const sessionSecret = randomBytes(48).toString("base64url");

function replaceEmpty(name, value) {
  const pattern = new RegExp(`^${name}=\\s*$`, "m");
  if (!pattern.test(source)) throw new Error(`${name} is missing or already configured. No values were changed.`);
  source = source.replace(pattern, `${name}=${value}`);
}

replaceEmpty("ADMIN_PASSWORD_HASH", passwordHash);
replaceEmpty("SESSION_SECRET", sessionSecret);
await writeFile(envUrl, source, "utf8");

console.log(`One-time admin password: ${password}`);
console.log("ADMIN_PASSWORD_HASH and SESSION_SECRET were written to .env.");
