import { query } from "./_lib/db.js";
import { allowMethods, handleApiError } from "./_lib/http.js";
import { projectRowToJson } from "./_lib/projects.js";

export default async function handler(request, response) {
  if (!allowMethods(request, response, ["GET"])) return;
  try {
    const [sectionRows, projectRows] = await Promise.all([
      query("select key, data from portfolio_sections where published = true order by sort_order, key"),
      query("select * from portfolio_projects where published = true and deleted_at is null order by sort_order, created_at"),
    ]);
    const sections = Object.fromEntries(sectionRows.map((row) => [row.key, row.data]));
    response.setHeader("Cache-Control", "public, s-maxage=60, stale-while-revalidate=300");
    response.statusCode = 200;
    response.setHeader("Content-Type", "application/json; charset=utf-8");
    response.end(JSON.stringify({ sections, projects: projectRows.map(projectRowToJson) }));
  } catch (error) {
    handleApiError(response, error);
  }
}
