import { createHash, createHmac, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { query } from "./db.js";
import { sendJson } from "./http.js";

const COOKIE_NAME = "jabir_admin_session";
const SESSION_SECONDS = 60 * 60 * 12;
const loginAttempts = new Map();

function encode(value) {
  return Buffer.from(value).toString("base64url");
}

function sign(value) {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) {
    const error = new Error("SESSION_SECRET must contain at least 32 characters.");
    error.statusCode = 503;
    throw error;
  }
  return createHmac("sha256", secret).update(value).digest("base64url");
}

function credentialVersion(encodedHash) {
  return createHash("sha256").update(encodedHash).digest("base64url");
}

function parseCookies(request) {
  return Object.fromEntries((request.headers.cookie || "").split(";").map((part) => {
    const separator = part.indexOf("=");
    if (separator < 0) return ["", ""];
    try {
      return [part.slice(0, separator).trim(), decodeURIComponent(part.slice(separator + 1))];
    } catch {
      return ["", ""];
    }
  }).filter(([key]) => key));
}

function cookieSecurity() {
  return process.env.NODE_ENV === "production" ? "; Secure" : "";
}

export async function getAdminCredential() {
  const rows = await query("select email, password_hash from portfolio_admin_credentials where singleton = true");
  if (!rows[0]) {
    const error = new Error("Admin credentials have not been initialized.");
    error.statusCode = 503;
    throw error;
  }
  return { email: rows[0].email.trim().toLowerCase(), passwordHash: rows[0].password_hash };
}

export function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  return `scrypt:${salt}:${scryptSync(password, salt, 64).toString("hex")}`;
}

export function verifyPasswordHash(password, encodedHash) {
  const [algorithm, salt, expectedHex] = String(encodedHash || "").split(":");
  if (algorithm !== "scrypt" || !salt || !expectedHex) {
    const error = new Error("Stored admin credentials are invalid.");
    error.statusCode = 503;
    throw error;
  }
  const actual = scryptSync(password, salt, 64);
  const expected = Buffer.from(expectedHex, "hex");
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

export function createSessionCookie(passwordHash) {
  const payload = encode(JSON.stringify({
    sub: "portfolio-admin",
    credentialVersion: credentialVersion(passwordHash),
    exp: Math.floor(Date.now() / 1000) + SESSION_SECONDS,
  }));
  const token = `${payload}.${sign(payload)}`;
  return `${COOKIE_NAME}=${encodeURIComponent(token)}; Path=/; HttpOnly${cookieSecurity()}; SameSite=Strict; Max-Age=${SESSION_SECONDS}`;
}

export function clearSessionCookie() {
  return `${COOKIE_NAME}=; Path=/; HttpOnly${cookieSecurity()}; SameSite=Strict; Max-Age=0`;
}

export async function isAdminRequest(request) {
  if (!process.env.SESSION_SECRET || process.env.SESSION_SECRET.length < 32) return false;
  const token = parseCookies(request)[COOKIE_NAME];
  if (!token) return false;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return false;
  const expected = sign(payload);
  if (signature.length !== expected.length || !timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return false;
  try {
    const session = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    if (session.sub !== "portfolio-admin" || session.exp <= Math.floor(Date.now() / 1000)) return false;
    const credential = await getAdminCredential();
    return session.credentialVersion === credentialVersion(credential.passwordHash);
  } catch {
    return false;
  }
}

export async function requireAdmin(request, response) {
  if (await isAdminRequest(request)) return true;
  sendJson(response, 401, { error: "Authentication required." });
  return false;
}

export async function verifyAdminPassword(password) {
  const credential = await getAdminCredential();
  const passwordMatches = verifyPasswordHash(password, credential.passwordHash);
  return { valid: passwordMatches, passwordHash: credential.passwordHash };
}

export function checkLoginRateLimit(request) {
  const forwarded = request.headers["x-forwarded-for"];
  const ip = (Array.isArray(forwarded) ? forwarded[0] : forwarded || request.socket?.remoteAddress || "unknown").split(",")[0].trim();
  const now = Date.now();
  const state = loginAttempts.get(ip) || { count: 0, startedAt: now };
  if (now - state.startedAt > 15 * 60 * 1000) {
    loginAttempts.set(ip, { count: 1, startedAt: now });
    return;
  }
  state.count += 1;
  loginAttempts.set(ip, state);
  if (state.count > 10) {
    const error = new Error("Too many login attempts. Try again later.");
    error.statusCode = 429;
    throw error;
  }
}

export function resetLoginRateLimit(request) {
  const forwarded = request.headers["x-forwarded-for"];
  const ip = (Array.isArray(forwarded) ? forwarded[0] : forwarded || request.socket?.remoteAddress || "unknown").split(",")[0].trim();
  loginAttempts.delete(ip);
}
