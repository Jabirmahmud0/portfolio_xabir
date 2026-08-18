import { requireAdmin } from "../../_lib/auth.js";
import { query } from "../../_lib/db.js";
import { allowMethods, assertSameOrigin, handleApiError, readJson, sendJson } from "../../_lib/http.js";
import { normalizeProject, projectRowToJson } from "../../_lib/projects.js";

export default async function handler(request, response) {
  if (!allowMethods(request, response, ["GET", "POST"])) return;
  if (!await requireAdmin(request, response)) return;
  try {
    if (request.method === "GET") {
      const rows = await query("select * from portfolio_projects where deleted_at is null order by sort_order, created_at");
      sendJson(response, 200, { projects: rows.map(projectRowToJson) });
      return;
    }

    assertSameOrigin(request);
    const project = normalizeProject(await readJson(request));
    const rows = await query(
      `insert into portfolio_projects
        (slug, section, name, description, tags, github_url, backend_url, live_url, deployments, image_url, status, category, featured, homepage, published, sort_order, case_study)
       values ($1,$2,$3,$4,$5::jsonb,$6,$7,$8,$9::jsonb,$10,$11,$12,$13,$14,$15,$16,$17::jsonb)
       returning *`,
      [project.slug, project.section, project.name, project.desc, JSON.stringify(project.tags), project.github || null, project.backend || null, project.live || null, JSON.stringify(project.deployments), project.image || null, project.status || null, project.category || null, project.featured, project.homepage, project.published, project.sortOrder, JSON.stringify(project.caseStudy)],
    );
    sendJson(response, 201, { project: projectRowToJson(rows[0]) });
  } catch (error) {
    handleApiError(response, error);
  }
}
