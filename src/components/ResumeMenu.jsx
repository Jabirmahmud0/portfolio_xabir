import { useEffect, useMemo, useRef, useState } from "react";
import { usePortfolioData } from "../PortfolioDataContext.js";
import { ExternalIcon } from "./PortfolioUI.jsx";

export default function ResumeMenu({ themeObj, label = "View resume", variant = "primary" }) {
  const { sections } = usePortfolioData();
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);
  const resumes = useMemo(() => {
    const configured = (sections.resumes?.items || [])
      .filter((resume) => resume.visible && resume.url)
      .sort((a, b) => Number(a.sortOrder) - Number(b.sortOrder));
    if (configured.length) return configured;
    return sections.profile?.resumeUrl ? [{ id: "default", role: "Software Engineer", label: "Software Engineer Resume", description: "", url: sections.profile.resumeUrl, primary: true }] : [];
  }, [sections.profile?.resumeUrl, sections.resumes?.items]);

  useEffect(() => {
    if (!open) return;
    function closeOnOutsideClick(event) {
      if (!containerRef.current?.contains(event.target)) setOpen(false);
    }
    function closeOnEscape(event) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  if (!resumes.length) return null;

  const buttonClass = variant === "primary"
    ? `inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 ${themeObj.primaryButton}`
    : `inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-semibold ${themeObj.border} ${themeObj.buttonBg} ${themeObj.buttonText}`;

  return (
    <div ref={containerRef} className="relative">
      <button type="button" onClick={() => setOpen((value) => !value)} aria-haspopup="menu" aria-expanded={open} className={buttonClass}>
        {label}
        <svg aria-hidden="true" viewBox="0 0 20 20" className={`h-4 w-4 fill-current transition-transform duration-300 ${open ? "rotate-180" : ""}`}><path d="m5.5 7.5 4.5 4 4.5-4 1 1-5.5 5-5.5-5 1-1Z" /></svg>
      </button>
      {open && (
        <>
          <button type="button" aria-label="Close resume menu" onClick={() => setOpen(false)} className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[2px] sm:bg-transparent sm:backdrop-blur-none" />
          <div role="menu" aria-label="Resumes by role" className={`fixed inset-x-4 bottom-4 z-50 overflow-hidden rounded-2xl border p-2 shadow-2xl sm:absolute sm:inset-x-auto sm:bottom-auto sm:left-0 sm:top-[calc(100%+0.75rem)] sm:w-[390px] ${themeObj.card} ${themeObj.border}`}>
            <div className="px-4 pb-3 pt-2">
              <p className={`text-xs font-bold uppercase tracking-[0.17em] ${themeObj.accent}`}>Resume by role</p>
              <p className={`mt-1 text-sm ${themeObj.muted}`}>Open the version that matches the opportunity.</p>
            </div>
            <div className="space-y-1">
              {resumes.map((resume) => (
                <a key={resume.id} role="menuitem" href={resume.url} target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)} className={`group flex items-start justify-between gap-4 rounded-xl px-4 py-3.5 transition-colors ${themeObj.buttonBg}`}>
                  <span>
                    <span className={`flex items-center gap-2 text-sm font-semibold ${themeObj.text}`}>{resume.role}{resume.primary && <span className={`rounded-full px-2 py-0.5 text-[9px] uppercase tracking-wider ${themeObj.tag}`}>Primary</span>}</span>
                    {resume.description && <span className={`mt-1 block text-xs leading-5 ${themeObj.muted}`}>{resume.description}</span>}
                  </span>
                  <span className={`mt-0.5 shrink-0 ${themeObj.link}`}><ExternalIcon /></span>
                </a>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
