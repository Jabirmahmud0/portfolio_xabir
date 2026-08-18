import { neon } from "@neondatabase/serverless";
import { projects } from "../src/data/projects.js";
import { fallbackSections } from "../src/data/siteContent.js";

if (!process.env.DATABASE_URL) throw new Error("Set DATABASE_URL before seeding.");
const sql = neon(process.env.DATABASE_URL);

let sectionOrder = 0;
for (const [key, data] of Object.entries(fallbackSections)) {
  await sql.query(
    `insert into portfolio_sections (key, data, published, sort_order)
     values ($1,$2::jsonb,true,$3)
     on conflict (key) do update set data=excluded.data, sort_order=excluded.sort_order, updated_at=now()`,
    [key, JSON.stringify(data), sectionOrder++],
  );
}

for (const [index, project] of projects.entries()) {
  await sql.query(
    `insert into portfolio_projects
      (slug, section, name, description, tags, github_url, backend_url, live_url, deployments, image_url, status, category, featured, homepage, published, sort_order, case_study)
     values ($1,$2,$3,$4,$5::jsonb,$6,$7,$8,$9::jsonb,$10,$11,$12,$13,$14,true,$15,$16::jsonb)
     on conflict (slug) do update set section=excluded.section, name=excluded.name, description=excluded.description,
      tags=excluded.tags, github_url=excluded.github_url, backend_url=excluded.backend_url, live_url=excluded.live_url,
      deployments=excluded.deployments, image_url=excluded.image_url, status=excluded.status, category=excluded.category,
      featured=excluded.featured, homepage=excluded.homepage, sort_order=excluded.sort_order,
      case_study=excluded.case_study, updated_at=now()`,
    [project.slug, project.section, project.name, project.desc, JSON.stringify(project.tags || []), project.github || null, project.backend || null, project.live || null, JSON.stringify(project.deployments || []), project.image || null, project.live ? "Deployed" : project.status || null, project.category || null, Boolean(project.featured), Boolean(project.homepage), index, JSON.stringify(project.caseStudy || {})],
  );
}
if (process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD_HASH) {
  await sql.query(
    `insert into portfolio_admin_credentials (singleton, email, password_hash)
     values (true, $1, $2)
     on conflict (singleton) do nothing`,
    [process.env.ADMIN_EMAIL.trim().toLowerCase(), process.env.ADMIN_PASSWORD_HASH],
  );
}
console.log(`Seeded ${Object.keys(fallbackSections).length} content sections and ${projects.length} projects.`);
