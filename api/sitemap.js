import { query } from "./_lib/db.js";
import { projects as fallbackProjects } from "../src/data/projects.js";

function sitemapXml(slugs) {
  const urls = ["", "projects", ...slugs.map((slug) => `projects/${slug}`)];
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((path) => `  <url><loc>https://jabir.pro.bd/${path}</loc></url>`).join("\n")}
</urlset>`;
}

export default async function handler(request, response) {
  if (request.method !== "GET") {
    response.setHeader("Allow", "GET");
    response.statusCode = 405;
    response.end("Method not allowed");
    return;
  }

  let slugs;
  try {
    const rows = await query("select slug from portfolio_projects where published = true and deleted_at is null and case_study <> '{}'::jsonb and case_study <> 'null'::jsonb order by sort_order");
    slugs = rows.map((row) => row.slug);
  } catch {
    slugs = fallbackProjects.filter((project) => project.caseStudy).map((project) => project.slug);
  }
  response.setHeader("Content-Type", "application/xml; charset=utf-8");
  response.setHeader("Cache-Control", "public, s-maxage=300, stale-while-revalidate=3600");
  response.statusCode = 200;
  response.end(sitemapXml(slugs));
}
