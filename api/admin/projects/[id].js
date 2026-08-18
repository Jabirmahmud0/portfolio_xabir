import { requireAdmin } from "../../_lib/auth.js";
import { query } from "../../_lib/db.js";
import { allowMethods, assertSameOrigin, handleApiError, readJson, sendJson } from "../../_lib/http.js";
import { normalizeProject, projectApiError, projectRowToJson } from "../../_lib/projects.js";

export default async function handler(request, response) {
  if (!allowMethods(request, response, ["PUT", "DELETE"])) return;
  if (!await requireAdmin(request, response)) return;
  try {
    assertSameOrigin(request);
    const id = request.query?.id;
    if (!id) {
      sendJson(response, 400, { error: "Project ID is required." });
      return;
    }

    if (request.method === "DELETE") {
      const rows = await query("update portfolio_projects set deleted_at = now(), updated_at = now() where id = $1 and deleted_at is null returning id", [id]);
      if (!rows[0]) {
        sendJson(response, 404, { error: "Project not found." });
        return;
      }
      sendJson(response, 200, { deleted: true });
      return;
    }

    const project = normalizeProject(await readJson(request));
    const rows = await query(
      `update portfolio_projects set
        slug=$2, section=$3, name=$4, description=$5, tags=$6::jsonb, github_url=$7, backend_url=$8,
        live_url=$9, deployments=$10::jsonb, image_url=$11, status=$12, category=$13, featured=$14,
        homepage=$15, published=$16, sort_order=$17, case_study=$18::jsonb, updated_at=now()
       where id=$1 and deleted_at is null returning *`,
      [id, project.slug, project.section, project.name, project.desc, JSON.stringify(project.tags), project.github || null, project.backend || null, project.live || null, JSON.stringify(project.deployments), project.image || null, project.status || null, project.category || null, project.featured, project.homepage, project.published, project.sortOrder, JSON.stringify(project.caseStudy)],
    );
    if (!rows[0]) {
      sendJson(response, 404, { error: "Project not found." });
      return;
    }
    sendJson(response, 200, { project: projectRowToJson(rows[0]) });
  } catch (error) {
    handleApiError(response, projectApiError(error));
  }
}
