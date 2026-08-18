import { useEffect, useState } from "react";
import { adminApi } from "./adminApi.js";
import ImageField from "./ImageField.jsx";

const tabs = ["profile", "about", "skills", "education", "contact", "site"];
const inputClass = "mt-1 w-full rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-sm text-neutral-900 outline-none transition focus:border-[#00786B] focus:ring-2 focus:ring-[#00786B]/15";

function Field({ label, children, wide = false }) {
  return <label className={wide ? "block md:col-span-2" : "block"}><span className="text-xs font-bold uppercase tracking-[0.12em] text-neutral-500">{label}</span>{children}</label>;
}

function ProfileFields({ value, setValue }) {
  return <div className="grid gap-5 md:grid-cols-2">
    {["eyebrow", "name", "availability", "email"].map((field) => <Field key={field} label={field}><input className={inputClass} value={value[field] || ""} onChange={(e) => setValue({ ...value, [field]: e.target.value })} /></Field>)}
    <Field label="Introduction" wide><textarea rows="4" className={inputClass} value={value.intro || ""} onChange={(e) => setValue({ ...value, intro: e.target.value })} /></Field>
    <Field label="Focus areas (one per line)" wide><textarea rows="4" className={inputClass} value={(value.focusAreas || []).join("\n")} onChange={(e) => setValue({ ...value, focusAreas: e.target.value.split("\n").map((item) => item.trim()).filter(Boolean) })} /></Field>
    <Field label="Social links (Label | URL)" wide><textarea rows="5" className={inputClass} value={(value.socialLinks || []).map((item) => `${item.label} | ${item.url}`).join("\n")} onChange={(e) => setValue({ ...value, socialLinks: e.target.value.split("\n").map((line) => { const [label, ...url] = line.split("|"); return { label: label?.trim(), url: url.join("|").trim() }; }).filter((item) => item.label && item.url) })} /></Field>
  </div>;
}

function AboutFields({ value, setValue }) {
  return <div className="grid gap-5 md:grid-cols-2"><ImageField label="Light-mode portrait" value={value.lightImage} onChange={(image) => setValue({ ...value, lightImage: image })} /><ImageField label="Dark-mode portrait" value={value.darkImage} onChange={(image) => setValue({ ...value, darkImage: image })} /><Field label="Paragraphs (separate with a blank line)" wide><textarea rows="14" className={inputClass} value={(value.paragraphs || []).join("\n\n")} onChange={(e) => setValue({ ...value, paragraphs: e.target.value.split(/\n\s*\n/).map((item) => item.trim()).filter(Boolean) })} /></Field></div>;
}

function SkillsFields({ value, setValue }) {
  const groups = value.groups || [];
  function updateGroup(index, changes) {
    setValue({ ...value, groups: groups.map((group, groupIndex) => groupIndex === index ? { ...group, ...changes } : group) });
  }
  return <div className="space-y-5">{groups.map((group, index) => <div key={index} className="rounded-xl border border-neutral-200 p-5"><div className="grid gap-4 md:grid-cols-2"><Field label="Group label"><input className={inputClass} value={group.label} onChange={(e) => updateGroup(index, { label: e.target.value })} /></Field><Field label="Group title"><input className={inputClass} value={group.title} onChange={(e) => updateGroup(index, { title: e.target.value })} /></Field><Field label="Skills (Name | Detail)" wide><textarea rows="6" className={inputClass} value={(group.items || []).map((item) => `${item.name} | ${item.detail}`).join("\n")} onChange={(e) => updateGroup(index, { items: e.target.value.split("\n").map((line) => { const [name, ...detail] = line.split("|"); return { name: name?.trim(), detail: detail.join("|").trim() }; }).filter((item) => item.name && item.detail) })} /></Field></div><button type="button" onClick={() => setValue({ ...value, groups: groups.filter((_, groupIndex) => groupIndex !== index) })} className="mt-4 text-sm font-semibold text-red-700">Remove group</button></div>)}<button type="button" onClick={() => setValue({ ...value, groups: [...groups, { label: "New group", title: "", items: [] }] })} className="rounded-lg border border-[#00786B]/30 px-4 py-2 text-sm font-bold text-[#00786B]">+ Add skill group</button></div>;
}

function EducationFields({ value, setValue }) {
  return <div className="grid gap-5 md:grid-cols-2">{["degree", "institution", "graduation", "certificationLabel"].map((field) => <Field key={field} label={field}><input className={inputClass} value={value[field] || ""} onChange={(e) => setValue({ ...value, [field]: e.target.value })} /></Field>)}<Field label="Certifications (one per line)" wide><textarea rows="6" className={inputClass} value={(value.certifications || []).join("\n")} onChange={(e) => setValue({ ...value, certifications: e.target.value.split("\n").map((item) => item.trim()).filter(Boolean) })} /></Field></div>;
}

function SimpleFields({ value, setValue, fields }) {
  return <div className="grid gap-5 md:grid-cols-2">{fields.map(([field, multiline]) => <Field key={field} label={field} wide={multiline}>{multiline ? <textarea rows="5" className={inputClass} value={value[field] || ""} onChange={(e) => setValue({ ...value, [field]: e.target.value })} /> : <input className={inputClass} value={value[field] || ""} onChange={(e) => setValue({ ...value, [field]: e.target.value })} />}</Field>)}</div>;
}

export default function ContentManager({ sections, onChange }) {
  const [active, setActive] = useState("profile");
  const [draft, setDraft] = useState(() => Object.fromEntries(sections.map((section) => [section.key, structuredClone(section)])));
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const section = draft[active] || { key: active, data: {}, published: true, sort_order: tabs.indexOf(active) };
  const setValue = (data) => setDraft((current) => ({ ...current, [active]: { ...section, data } }));

  useEffect(() => {
    if (!sections.length) return;
    setDraft(Object.fromEntries(sections.map((item) => [item.key, structuredClone(item)])));
  }, [sections]);

  async function save() {
    setBusy(true); setMessage("");
    try {
      const result = await adminApi.updateSection({ key: active, data: section.data, published: section.published, sortOrder: section.sort_order });
      setDraft((current) => ({ ...current, [active]: result.section }));
      onChange(Object.values({ ...draft, [active]: result.section }));
      setMessage("Content saved.");
    } catch (error) { setMessage(error.message); } finally { setBusy(false); }
  }

  return <div className="grid gap-6 xl:grid-cols-[220px_minmax(0,1fr)]"><aside className="rounded-2xl border border-neutral-200 bg-white p-3 shadow-sm">{tabs.map((tab) => <button key={tab} onClick={() => { setActive(tab); setMessage(""); }} className={`mb-1 w-full rounded-lg px-4 py-3 text-left text-sm font-semibold capitalize ${active === tab ? "bg-[#00786B]/10 text-[#00675d]" : "text-neutral-600 hover:bg-neutral-100"}`}>{tab}</button>)}</aside><section className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm md:p-7"><div className="mb-7 flex flex-wrap items-center justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-[#00786B]">Site content</p><h2 className="mt-1 text-2xl font-bold capitalize text-neutral-950">{active}</h2></div><button onClick={save} disabled={busy} className="rounded-lg bg-[#00786B] px-5 py-2.5 text-sm font-bold text-white disabled:opacity-50">{busy ? "Saving..." : "Save changes"}</button></div>{message && <p className={`mb-5 rounded-lg px-3 py-2 text-sm ${message === "Content saved." ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>{message}</p>}
    {active === "profile" && <ProfileFields value={section.data} setValue={setValue} />}
    {active === "about" && <AboutFields value={section.data} setValue={setValue} />}
    {active === "skills" && <SkillsFields value={section.data} setValue={setValue} />}
    {active === "education" && <EducationFields value={section.data} setValue={setValue} />}
    {active === "contact" && <SimpleFields value={section.data} setValue={setValue} fields={[["kicker", false], ["headline", false], ["body", true], ["locationLine", true]]} />}
    {active === "site" && <SimpleFields value={section.data} setValue={setValue} fields={[["title", false], ["description", true], ["canonicalUrl", false]]} />}
  </section></div>;
}
