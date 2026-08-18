import { useEffect, useState } from "react";
import { adminApi } from "./adminApi.js";

const inputClass = "mt-1 w-full rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-sm text-neutral-900 outline-none transition focus:border-[#00786B] focus:ring-2 focus:ring-[#00786B]/15";

function createResume(index) {
  return {
    id: crypto.randomUUID?.() || `resume-${Date.now()}`,
    role: "",
    label: "",
    description: "",
    url: "",
    publicId: "",
    visible: false,
    primary: false,
    sortOrder: index,
    updatedAt: "",
  };
}

export default function ResumeManager({ sections, onChange }) {
  const resumeSection = sections.find((section) => section.key === "resumes");
  const [items, setItems] = useState(() => structuredClone(resumeSection?.data?.items || []));
  const [busy, setBusy] = useState(false);
  const [uploadingId, setUploadingId] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    setItems(structuredClone(resumeSection?.data?.items || []));
  }, [resumeSection]);

  function update(id, changes) {
    setItems((current) => current.map((item) => item.id === id ? { ...item, ...changes } : item));
  }

  function makePrimary(id) {
    setItems((current) => current.map((item) => ({ ...item, primary: item.id === id })));
  }

  async function persist(nextItems, successMessage) {
    const result = await adminApi.updateSection({
      key: "resumes",
      data: { items: nextItems },
      published: true,
      sortOrder: resumeSection?.sort_order ?? 6,
    });
    onChange([...sections.filter((section) => section.key !== "resumes"), result.section]);
    setItems(structuredClone(nextItems));
    setMessage(successMessage);
  }

  async function save() {
    setBusy(true);
    setMessage("");
    try {
      const normalized = items.map((item, index) => ({
        ...item,
        role: item.role.trim(),
        label: item.label.trim() || `${item.role.trim()} Resume`,
        description: item.description.trim(),
        sortOrder: Number.isFinite(Number(item.sortOrder)) ? Number(item.sortOrder) : index,
        visible: Boolean(item.visible && item.url),
      }));
      if (!normalized.some((item) => item.primary) && normalized.length) normalized[0].primary = true;
      await persist(normalized, "Resume settings saved.");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setBusy(false);
    }
  }

  async function upload(item, file) {
    if (!file) return;
    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      setMessage("Only PDF resume files are supported.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setMessage("Resume PDF must be 10 MB or smaller.");
      return;
    }
    setUploadingId(item.id);
    setMessage("");
    const previousPublicId = item.publicId;
    try {
      const uploaded = await adminApi.uploadResume(file);
      const next = items.map((resume) => resume.id === item.id ? {
        ...resume,
        url: uploaded.url,
        publicId: uploaded.publicId,
        visible: true,
        updatedAt: new Date().toISOString().slice(0, 10),
      } : resume);
      await persist(next, `${item.role || "Resume"} uploaded and published.`);
      if (previousPublicId) await adminApi.deleteResume(previousPublicId);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setUploadingId("");
    }
  }

  async function remove(item) {
    if (!window.confirm(`Delete ${item.role || "this resume"}? This removes it from the portfolio.`)) return;
    setBusy(true);
    setMessage("");
    try {
      const remaining = items.filter((resume) => resume.id !== item.id);
      if (item.primary && remaining.length) remaining[0] = { ...remaining[0], primary: true };
      await persist(remaining, "Resume deleted.");
      if (item.publicId) await adminApi.deleteResume(item.publicId);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <section>
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div><p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#00786B]">Public documents</p><h1 className="mt-2 text-4xl font-semibold tracking-[-0.04em]">Role-specific resumes</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-500">Upload, replace, order, or hide each version. Only visible resumes with a PDF appear publicly.</p></div>
        <div className="flex gap-2"><button type="button" onClick={() => setItems((current) => [...current, createResume(current.length)])} className="rounded-xl border border-[#00786B]/30 px-4 py-2.5 text-sm font-bold text-[#00786B]">+ Add resume</button><button type="button" disabled={busy} onClick={save} className="rounded-xl bg-[#00786B] px-5 py-2.5 text-sm font-bold text-white disabled:opacity-50">{busy ? "Saving..." : "Save settings"}</button></div>
      </div>
      {message && <p role="status" className={`mt-6 rounded-xl px-4 py-3 text-sm ${message.includes("saved") || message.includes("uploaded") || message.includes("deleted") ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>{message}</p>}
      <div className="mt-8 space-y-5">
        {[...items].sort((a, b) => Number(a.sortOrder) - Number(b.sortOrder)).map((item) => (
          <article key={item.id} className="grid gap-6 rounded-[1.5rem] border border-black/10 bg-white p-5 shadow-sm lg:grid-cols-[1fr_220px] lg:p-7">
            <div className="grid gap-5 md:grid-cols-2">
              <label className="text-xs font-bold uppercase tracking-[0.12em] text-neutral-500">Role<input className={inputClass} value={item.role} onChange={(event) => update(item.id, { role: event.target.value })} placeholder="Frontend Engineer" /></label>
              <label className="text-xs font-bold uppercase tracking-[0.12em] text-neutral-500">Public label<input className={inputClass} value={item.label} onChange={(event) => update(item.id, { label: event.target.value })} placeholder="Frontend Engineer Resume" /></label>
              <label className="text-xs font-bold uppercase tracking-[0.12em] text-neutral-500 md:col-span-2">Short description<input className={inputClass} value={item.description} onChange={(event) => update(item.id, { description: event.target.value })} /></label>
              <label className="text-xs font-bold uppercase tracking-[0.12em] text-neutral-500">PDF URL<input className={inputClass} value={item.url} onChange={(event) => update(item.id, { url: event.target.value, publicId: "" })} placeholder="Upload a PDF or paste a URL" /></label>
              <label className="text-xs font-bold uppercase tracking-[0.12em] text-neutral-500">Display order<input type="number" className={inputClass} value={item.sortOrder} onChange={(event) => update(item.id, { sortOrder: Number(event.target.value) })} /></label>
            </div>
            <div className="flex flex-col justify-between rounded-2xl bg-[#f1f0ea] p-4">
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold"><input type="checkbox" checked={item.visible} disabled={!item.url} onChange={(event) => update(item.id, { visible: event.target.checked })} className="h-4 w-4 accent-[#00786B]" />Visible publicly</label>
                <label className="mt-3 flex items-center gap-2 text-sm font-semibold"><input type="radio" name="primary-resume" checked={item.primary} onChange={() => makePrimary(item.id)} className="h-4 w-4 accent-[#00786B]" />Primary version</label>
                {item.updatedAt && <p className="mt-4 font-mono text-[10px] uppercase tracking-wider text-neutral-400">Updated {item.updatedAt}</p>}
              </div>
              <div className="mt-6 space-y-2">
                <label className="flex cursor-pointer items-center justify-center rounded-xl bg-[#082e2a] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#00786B]">{uploadingId === item.id ? "Uploading..." : item.url ? "Replace PDF" : "Upload PDF"}<input type="file" accept="application/pdf,.pdf" disabled={uploadingId === item.id} onChange={(event) => { const file = event.target.files?.[0]; event.target.value = ""; upload(item, file); }} className="sr-only" /></label>
                {item.url && <a href={item.url} target="_blank" rel="noopener noreferrer" className="block rounded-xl border border-black/10 px-4 py-2.5 text-center text-sm font-semibold">Open PDF</a>}
                <button type="button" disabled={busy} onClick={() => remove(item)} className="w-full px-4 py-2 text-sm font-semibold text-red-700">Delete resume</button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
