const textFields = ["slug", "section", "name", "desc", "github", "backend", "live", "image", "status", "category"];

function validateUrl(value, label, allowLocal = false) {
  if (!value) return;
  if (allowLocal && value.startsWith("/") && !value.startsWith("//")) return;
  try {
    const parsed = new URL(value);
    if (parsed.protocol === "https:" || parsed.protocol === "http:") return;
  } catch {
    // The common validation error below is intentionally used for malformed URLs.
  }
  const error = new Error(`${label} must be an HTTP(S) URL${allowLocal ? " or a local /path" : ""}.`);
  error.statusCode = 400;
  throw error;
}

export function normalizeProject(input) {
  const project = {};
  for (const field of textFields) project[field] = typeof input[field] === "string" ? input[field].trim() : "";
  project.tags = Array.isArray(input.tags) ? input.tags.map(String).map((tag) => tag.trim()).filter(Boolean).slice(0, 20) : [];
  project.deployments = Array.isArray(input.deployments) ? input.deployments.map((item) => ({
    label: String(item?.label || "").trim(),
    url: String(item?.url || "").trim(),
  })).filter((item) => item.label && item.url).slice(0, 10) : [];
  const caseStudy = {
    challenge: String(input.caseStudy?.challenge || "").trim(),
    approach: String(input.caseStudy?.approach || "").trim(),
    highlights: Array.isArray(input.caseStudy?.highlights) ? input.caseStudy.highlights.map(String).map((item) => item.trim()).filter(Boolean).slice(0, 20) : [],
    proof: String(input.caseStudy?.proof || "").trim(),
  };
  project.caseStudy = caseStudy.challenge || caseStudy.approach || caseStudy.highlights.length || caseStudy.proof ? caseStudy : null;
  project.featured = Boolean(input.featured);
  project.homepage = Boolean(input.homepage);
  project.published = input.published !== false;
  project.sortOrder = Number.isFinite(Number(input.sortOrder)) ? Number(input.sortOrder) : 0;

  if (!project.slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(project.slug)) {
    const error = new Error("Slug must use lowercase letters, numbers, and hyphens.");
    error.statusCode = 400;
    throw error;
  }
  if (!project.name || !project.section || !project.desc) {
    const error = new Error("Name, section, and description are required.");
    error.statusCode = 400;
    throw error;
  }
  if (!["full-stack", "ai-tools", "frontend-ui"].includes(project.section)) {
    const error = new Error("Project section is invalid.");
    error.statusCode = 400;
    throw error;
  }
  validateUrl(project.github, "GitHub URL");
  validateUrl(project.backend, "Backend URL");
  validateUrl(project.live, "Live URL");
  validateUrl(project.image, "Image URL", true);
  for (const deployment of project.deployments) validateUrl(deployment.url, `${deployment.label} deployment URL`);
  if (project.live) project.status = "Deployed";
  return project;
}

function normalizeCaseStudy(value) {
  if (!value || typeof value !== "object") return null;
  const normalized = {
    challenge: String(value.challenge || ""),
    approach: String(value.approach || ""),
    highlights: Array.isArray(value.highlights) ? value.highlights : [],
    proof: String(value.proof || ""),
  };
  return normalized.challenge || normalized.approach || normalized.highlights.length || normalized.proof ? normalized : null;
}

export function projectRowToJson(row) {
  return {
    id: row.id,
    slug: row.slug,
    section: row.section,
    name: row.name,
    desc: row.description,
    tags: row.tags || [],
    github: row.github_url || "",
    backend: row.backend_url || "",
    live: row.live_url || "",
    deployments: row.deployments || [],
    image: row.image_url || "",
    status: row.live_url ? "Deployed" : row.status || "",
    category: row.category || "",
    featured: row.featured,
    homepage: row.homepage,
    published: row.published,
    sortOrder: row.sort_order,
    caseStudy: normalizeCaseStudy(row.case_study),
    updatedAt: row.updated_at,
  };
}
