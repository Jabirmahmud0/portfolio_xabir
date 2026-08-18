import { requireAdmin } from "../_lib/auth.js";
import { query } from "../_lib/db.js";
import { allowMethods, assertSameOrigin, handleApiError, readJson, sendJson } from "../_lib/http.js";

export default async function handler(request, response) {
  if (!allowMethods(request, response, ["GET", "PUT"])) return;
  if (!await requireAdmin(request, response)) return;
  try {
    if (request.method === "GET") {
      const rows = await query("select key, data, published, sort_order, updated_at from portfolio_sections order by sort_order, key");
      sendJson(response, 200, { sections: rows });
      return;
    }
    assertSameOrigin(request);
    const body = await readJson(request);
    if (!body.key || typeof body.data !== "object" || Array.isArray(body.data)) {
      sendJson(response, 400, { error: "A section key and data object are required." });
      return;
    }
    const rows = await query(
      `insert into portfolio_sections (key, data, published, sort_order)
       values ($1,$2::jsonb,$3,$4)
       on conflict (key) do update set data=excluded.data, published=excluded.published, sort_order=excluded.sort_order, updated_at=now()
       returning key, data, published, sort_order, updated_at`,
      [String(body.key), JSON.stringify(body.data), body.published !== false, Number(body.sortOrder) || 0],
    );
    sendJson(response, 200, { section: rows[0] });
  } catch (error) {
    handleApiError(response, error);
  }
}
