import { neon } from "@neondatabase/serverless";

let queryClient;

export function getDatabase() {
  if (!process.env.DATABASE_URL) {
    const error = new Error("DATABASE_URL is not configured.");
    error.statusCode = 503;
    throw error;
  }

  queryClient ??= neon(process.env.DATABASE_URL);
  return queryClient;
}

export async function query(text, params = []) {
  return getDatabase().query(text, params);
}
