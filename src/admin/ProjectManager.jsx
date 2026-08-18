import { useEffect, useMemo, useState } from "react";
import { adminApi } from "./adminApi.js";
import ImageField from "./ImageField.jsx";

const emptyProject = {
  slug: "", section: "full-stack", name: "", desc: "", tags: [], github: "", backend: "", live: "",
  deployments: [], image: "", status: "In development", category: "", featured: false, homepage: false,
  published: true, sortOrder: 0,
  caseStudy: { challenge: "", approach: "", highlights: [], proof: "" },
};

const inputClass = "mt-1 w-full rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-sm text-neutral-900 outline-none transition focus:border-[#00786B] focus:ring-2 focus:ring-[#00786B]/15";
const labelClass = "text-xs font-bold uppercase tracking-[0.12em] text-neutral-500";

function editableProject(project) {
  return {
    ...structuredClone(project),
    caseStudy: project.caseStudy || structuredClone(emptyProject.caseStudy),
  };
}

function Field({ label, children, className = "" }) {
  return <label className={`block ${className}`}><span className={labelClass}>{label}</span>{children}</label>;
}

export default function ProjectManager({ projects, onChange }) {
  const [selectedId, setSelectedId] = useState(projects[0]?.id || "new");
  const [creating, setCreating] = useState(false);
  const selected = useMemo(() => projects.find((project) => project.id === selectedId), [projects, selectedId]);
  const [draft, setDraft] = useState(() => selected ? editableProject(selected) : structuredClone(emptyProject));
  const [busy, setBusy] = useState(false);
  const [quickSavingId, setQuickSavingId] = useState("");
  const [message, setMessage] = useState("");
  const homepageCount = projects.filter((project) => project.homepage).length;

  useEffect(() => {
    if (creating || !projects.length || selected) return;
    setSelectedId(projects[0].id);
    setDraft(editableProject(projects[0]));
  }, [creating, projects, selected]);

  function choose(project) {
    setCreating(!project);
    setSelectedId(project?.id || "new");
    setDraft(project ? editableProject(project) : { ...structuredClone(emptyProject), sortOrder: projects.length });
    setMessage("");
  }

  function update(field, value) {
    setDraft((current) => ({
      ...current,
      [field]: value,
      ...(field === "live" && value.trim() ? { status: "Deployed" } : {}),
    }));
  }

  function updateCase(field, value) {
    setDraft((current) => ({ ...current, caseStudy: { ...current.caseStudy, [field]: value } }));
  }

  async function save(event) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    try {
      const result = draft.id ? await adminApi.updateProject(draft) : await adminApi.createProject(draft);
      const next = draft.id ? projects.map((item) => item.id === result.project.id ? result.project : item) : [...projects, result.project];
      onChange(next);
      choose(result.project);
      setMessage("Project saved.");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    if (!draft.id || !window.confirm(`Archive ${draft.name}? It will disappear from the public site.`)) return;
    setBusy(true);
    try {
      await adminApi.deleteProject(draft.id);
      const next = projects.filter((item) => item.id !== draft.id);
      onChange(next);
      choose(next[0]);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setBusy(false);
    }
  }

  async function toggleHomepage(project) {
    setQuickSavingId(project.id);
    setMessage("");
    try {
      const result = await adminApi.updateProject({ ...project, homepage: !project.homepage });
      const next = projects.map((item) => item.id === result.project.id ? result.project : item);
      onChange(next);
      if (draft.id === result.project.id) setDraft(editableProject(result.project));
      setMessage(result.project.homepage ? `${result.project.name} added to the homepage.` : `${result.project.name} removed from the homepage.`);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setQuickSavingId("");
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[280px_minmax(0,1fr)]">
      <aside className="sticky top-8 grid max-h-[calc(100vh-4rem)] self-start grid-rows-[auto_auto_minmax(0,1fr)] overflow-hidden rounded-2xl border border-neutral-200 bg-white p-3 shadow-sm">
        <button type="button" onClick={() => choose(null)} className="w-full rounded-xl bg-[#00786B] px-4 py-3 text-sm font-bold text-white hover:bg-[#00675d]">+ New project</button>
        <div className="mx-1 my-3 rounded-xl bg-[#082e2a] px-3 py-3 text-white">
          <div className="flex items-center justify-between gap-2"><span className="font-mono text-[9px] uppercase tracking-[0.17em] text-[#72cfc1]">Homepage showcase</span><strong className="text-lg">{homepageCount}</strong></div>
          <p className="mt-1 text-[11px] leading-4 text-white/50">Tap the circle beside any project to show or hide it.</p>
        </div>
        <div className="min-h-0 space-y-1 overflow-y-auto pr-1">
          {projects.map((project) => (
            <div key={project.id} className={`group grid grid-cols-[1fr_auto] items-center rounded-xl transition ${draft.id === project.id ? "bg-[#00786B]/10 text-[#00675d]" : "hover:bg-neutral-100"}`}>
              <button type="button" onClick={() => choose(project)} className="min-w-0 px-3 py-3 text-left">
                <span className="block text-sm font-semibold">{project.name}</span>
                <span className="mt-1 block text-xs text-neutral-500">{project.section} &middot; {project.published ? "Published" : "Draft"}</span>
              </button>
              <button
                type="button"
                disabled={quickSavingId === project.id}
                onClick={() => toggleHomepage(project)}
                aria-label={project.homepage ? `Remove ${project.name} from homepage` : `Show ${project.name} on homepage`}
                title={project.homepage ? "Shown on homepage" : "Not on homepage"}
                className={`mr-3 grid h-8 w-8 place-items-center rounded-full border transition-all duration-300 disabled:opacity-40 ${project.homepage ? "border-[#00786B] bg-[#00786B] text-white shadow-[0_0_0_4px_rgba(0,120,107,0.09)]" : "border-neutral-300 bg-white text-neutral-300 hover:border-[#00786B] hover:text-[#00786B]"}`}
              >
                {quickSavingId === project.id ? <span className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent motion-reduce:animate-none" /> : <span className="text-base leading-none">{project.homepage ? "\u2713" : "+"}</span>}
              </button>
            </div>
          ))}
        </div>
      </aside>

      <form onSubmit={save} className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm md:p-7">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div><p className="text-xs font-bold uppercase tracking-[0.16em] text-[#00786B]">Project editor</p><h2 className="mt-1 text-2xl font-bold text-neutral-950">{draft.id ? draft.name : "New project"}</h2></div>
          <div className="flex gap-2"><button type="button" disabled={!draft.id || busy} onClick={remove} className="rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-700 disabled:opacity-40">Archive</button><button disabled={busy} className="rounded-lg bg-[#00786B] px-5 py-2 text-sm font-bold text-white disabled:opacity-50">{busy ? "Saving..." : "Save project"}</button></div>
        </div>
        {message && <p className={`mt-4 rounded-lg px-3 py-2 text-sm ${message === "Project saved." ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>{message}</p>}

        <div className="mt-7 grid gap-5 md:grid-cols-2">
          <Field label="Project name"><input className={inputClass} value={draft.name} onChange={(e) => update("name", e.target.value)} required /></Field>
          <Field label="Slug"><input className={inputClass} value={draft.slug} onChange={(e) => update("slug", e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"))} required /></Field>
          <Field label="Section"><select className={inputClass} value={draft.section} onChange={(e) => update("section", e.target.value)}><option value="full-stack">Full-Stack</option><option value="ai-tools">AI Engineering</option><option value="frontend-ui">Frontend & UI</option></select></Field>
          <Field label="Category"><input className={inputClass} value={draft.category} onChange={(e) => update("category", e.target.value)} /></Field>
          <Field label={draft.live ? "Status (automatic)" : "Status"}><input className={`${inputClass} ${draft.live ? "cursor-not-allowed bg-neutral-100 text-neutral-500" : ""}`} value={draft.live ? "Deployed" : draft.status} readOnly={Boolean(draft.live)} onChange={(e) => update("status", e.target.value)} />{draft.live && <span className="mt-1 block text-xs text-[#00786B]">A Main live URL automatically marks this project as Deployed.</span>}</Field>
          <Field label="Display order"><input type="number" className={inputClass} value={draft.sortOrder} onChange={(e) => update("sortOrder", Number(e.target.value))} /><span className="mt-1 block text-xs text-neutral-400">Lower numbers appear first on the homepage and project archive.</span></Field>
          <Field label="Description" className="md:col-span-2"><textarea rows="4" className={inputClass} value={draft.desc} onChange={(e) => update("desc", e.target.value)} required /></Field>
          <Field label="Technology tags (comma separated)" className="md:col-span-2"><input className={inputClass} value={draft.tags.join(", ")} onChange={(e) => update("tags", e.target.value.split(",").map((tag) => tag.trim()).filter(Boolean))} /></Field>
          <Field label="Main live URL"><input type="url" className={inputClass} value={draft.live} onChange={(e) => update("live", e.target.value)} /></Field>
          <ImageField label="Project image" value={draft.image} onChange={(value) => update("image", value)} />
          <Field label="GitHub URL"><input type="url" className={inputClass} value={draft.github} onChange={(e) => update("github", e.target.value)} /></Field>
          <Field label="Backend URL"><input type="url" className={inputClass} value={draft.backend} onChange={(e) => update("backend", e.target.value)} /></Field>
          <Field label="Deployments (one Label | URL per line)" className="md:col-span-2"><textarea rows="4" className={inputClass} value={draft.deployments.map((item) => `${item.label} | ${item.url}`).join("\n")} onChange={(e) => update("deployments", e.target.value.split("\n").map((line) => { const [label, ...url] = line.split("|"); return { label: label?.trim(), url: url.join("|").trim() }; }).filter((item) => item.label && item.url))} /></Field>
        </div>

        <fieldset className="mt-8 rounded-xl border border-neutral-200 p-5"><legend className="px-2 text-sm font-bold text-neutral-800">Case study</legend><div className="grid gap-5">
          <Field label="Challenge"><textarea rows="4" className={inputClass} value={draft.caseStudy.challenge} onChange={(e) => updateCase("challenge", e.target.value)} /></Field>
          <Field label="Approach"><textarea rows="5" className={inputClass} value={draft.caseStudy.approach} onChange={(e) => updateCase("approach", e.target.value)} /></Field>
          <Field label="Highlights (one per line)"><textarea rows="6" className={inputClass} value={draft.caseStudy.highlights.join("\n")} onChange={(e) => updateCase("highlights", e.target.value.split("\n").map((item) => item.trim()).filter(Boolean))} /></Field>
          <Field label="Evidence"><textarea rows="4" className={inputClass} value={draft.caseStudy.proof} onChange={(e) => updateCase("proof", e.target.value)} /></Field>
        </div></fieldset>

        <div className="mt-7 flex flex-wrap gap-5">
          {[["published", "Published"], ["homepage", "Show on homepage"], ["featured", "Detailed case study"]].map(([field, label]) => <label key={field} className="flex items-center gap-2 text-sm font-semibold text-neutral-700"><input type="checkbox" className="h-4 w-4 accent-[#00786B]" checked={draft[field]} onChange={(e) => update(field, e.target.checked)} />{label}</label>)}
        </div>
      </form>
    </div>
  );
}
