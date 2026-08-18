import { useContext, useMemo, useState } from "react";
import { motion as Motion, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import { ThemeContext } from "../ThemeProvider.jsx";
import { usePortfolioData } from "../PortfolioDataContext.js";
import SEOHead from "./SEOHead.jsx";
import ThemeToggle from "./ThemeToggle.jsx";
import { ArrowIcon, ExternalIcon } from "./PortfolioUI.jsx";

const projectSections = [
  {
    id: "full-stack",
    title: "Full-Stack Applications",
    shortTitle: "Full-Stack",
    description: "End-to-end products covering interfaces, APIs, authentication, data, payments, and real-time workflows.",
  },
  {
    id: "ai-tools",
    title: "AI Engineering & Intelligent Products",
    shortTitle: "AI Engineering",
    description: "AI systems built around research pipelines, evidence, structured outputs, streaming progress, and reliable application infrastructure.",
  },
  {
    id: "frontend-ui",
    title: "Frontend & UI Engineering",
    shortTitle: "Frontend & UI",
    description: "Interfaces focused on interaction design, visualization, responsive behavior, and reusable UI systems.",
  },
];

function ProjectTitle({ project, className }) {
  if (project.caseStudy) {
    return <Link className={className} to={`/projects/${project.slug}`}>{project.name}</Link>;
  }

  return (
    <a className={className} href={project.live || project.github} target="_blank" rel="noopener noreferrer">
      {project.name}
    </a>
  );
}

function ProjectActions({ project, themeObj, alignRight }) {
  return (
    <div className={`mt-5 flex flex-wrap items-center gap-x-5 gap-y-3 text-sm font-semibold ${alignRight ? "lg:justify-end" : ""}`}>
      {project.caseStudy && (
        <Link className={`group inline-flex items-center gap-1.5 ${themeObj.link}`} to={`/projects/${project.slug}`}>
          Case study <ArrowIcon />
        </Link>
      )}
      {(project.deployments ?? []).map((deployment) => (
        <a key={deployment.url} className={`group inline-flex items-center gap-1.5 ${themeObj.link}`} href={deployment.url} target="_blank" rel="noopener noreferrer">
          {deployment.label} <ExternalIcon />
        </a>
      ))}
      {!project.deployments?.length && project.live && (
        <a className={`group inline-flex items-center gap-1.5 ${themeObj.link}`} href={project.live} target="_blank" rel="noopener noreferrer">
          Live demo <ExternalIcon />
        </a>
      )}
      {project.github && (
        <a className={`group inline-flex items-center gap-1.5 ${themeObj.link}`} href={project.github} target="_blank" rel="noopener noreferrer">
          GitHub <ExternalIcon />
        </a>
      )}
      {project.backend && (
        <a className={`group inline-flex items-center gap-1.5 ${themeObj.link}`} href={project.backend} target="_blank" rel="noopener noreferrer">
          Backend <ExternalIcon />
        </a>
      )}
    </div>
  );
}

function EditorialProject({ project, index, themeObj, reduceMotion }) {
  const alignRight = index % 2 === 1;
  const destination = project.live || project.github || project.deployments?.[0]?.url;

  return (
    <Motion.article
      initial={reduceMotion ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.45 }}
      className="group relative grid items-center lg:grid-cols-12"
    >
      <a
        href={destination}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Open ${project.live ? "live demo" : "GitHub repository"} for ${project.name}`}
        className={`relative order-1 overflow-hidden rounded-xl border p-4 shadow-sm lg:row-start-1 lg:col-span-7 ${alignRight ? "lg:col-start-1" : "lg:col-start-6"} ${themeObj.media} ${themeObj.border}`}
      >
        <img
          src={project.image}
          srcSet={/^\/[^/]+\.webp$/i.test(project.image) ? `${project.image.replace(/\.webp$/i, "-card.webp")} 1280w, ${project.image} 2560w` : undefined}
          sizes="(min-width: 1024px) 58vw, calc(100vw - 2rem)"
          alt={`${project.name} interface`}
          width="960"
          height="600"
          loading="lazy"
          decoding="async"
          className="aspect-[16/10] w-full object-contain transition-transform duration-500 group-hover:scale-[1.015]"
        />
        <span aria-hidden="true" className="absolute inset-0 bg-[#00786B]/10 opacity-40 transition-opacity duration-300 group-hover:opacity-0" />
      </a>

      <div className={`relative z-10 order-2 mt-6 flex flex-col lg:row-start-1 lg:col-span-6 lg:mt-0 lg:py-10 ${alignRight ? "lg:col-start-7 lg:items-end lg:text-right" : "lg:col-start-1 lg:items-start"}`}>
        <div className={`flex flex-wrap items-center gap-2 text-xs font-semibold ${alignRight ? "lg:justify-end" : ""}`}>
          <span className={themeObj.accent}>{project.status}</span>
          {project.featured && <span className={themeObj.muted}>Featured</span>}
          <span className={themeObj.muted}>/ {project.category}</span>
        </div>

        <h3 className="mt-2">
          <ProjectTitle
            project={project}
            className={`group/title inline-flex items-center gap-2 text-2xl font-bold tracking-tight md:text-3xl ${themeObj.text} ${themeObj.cardTitleHover}`}
          />
        </h3>

        <div className={`mt-5 w-full max-w-xl rounded-xl border p-5 shadow-lg md:p-6 ${themeObj.card} ${themeObj.border}`}>
          <p className={`leading-7 ${themeObj.muted}`}>{project.desc}</p>
        </div>

        <ul className={`mt-5 flex max-w-xl flex-wrap gap-x-5 gap-y-2 font-mono text-xs ${themeObj.muted} ${alignRight ? "lg:justify-end" : ""}`} aria-label="Technologies used">
          {project.tags.slice(0, 6).map((tag) => <li key={tag}>{tag}</li>)}
        </ul>

        <ProjectActions project={project} themeObj={themeObj} alignRight={alignRight} />
      </div>
    </Motion.article>
  );
}

export default function AllProjects() {
  const { theme, themes } = useContext(ThemeContext);
  const themeObj = themes[theme];
  const reduceMotion = useReducedMotion();
  const [search, setSearch] = useState("");
  const { projects } = usePortfolioData();

  const filteredProjects = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return projects;
    return projects.filter((project) => [project.name, project.desc, project.category, project.status, ...project.tags].join(" ").toLowerCase().includes(query));
  }, [projects, search]);

  const visibleSections = useMemo(() => projectSections
    .map((section) => ({ ...section, projects: filteredProjects.filter((project) => project.section === section.id) }))
    .filter((section) => section.projects.length > 0), [filteredProjects]);

  return (
    <main className={`min-h-screen ${themeObj.bg} ${themeObj.text} transition-colors duration-300`}>
      <SEOHead title="Projects - Jabir Mahmud" description="Full-stack applications, AI products, developer tools, and frontend engineering projects by Jabir Mahmud." canonicalUrl="https://jabir.pro.bd/projects" />

      <div className="mx-auto max-w-7xl px-6 py-6 md:px-10 md:py-8 lg:px-14">
        <header className="flex items-center justify-between gap-4">
          <Link to="/" className={`group inline-flex items-center gap-2 text-sm font-semibold ${themeObj.link}`}>
            <span aria-hidden="true" className="transition-transform group-hover:-translate-x-1">&larr;</span> Portfolio
          </Link>
          <ThemeToggle />
        </header>

        <section className={`grid gap-8 border-b pb-8 pt-10 md:pt-14 lg:grid-cols-[minmax(0,1fr)_minmax(340px,460px)] lg:items-end ${themeObj.border}`}>
          <div>
            <p className={`text-xs font-bold uppercase tracking-[0.2em] ${themeObj.accent}`}>Projects by focus</p>
            <h1 className={`mt-3 text-4xl font-bold tracking-[-0.04em] md:text-5xl lg:text-[3.5rem] ${themeObj.text}`}>Things I've built</h1>
            <p className={`mt-3 max-w-xl text-base leading-7 ${themeObj.muted}`}>
              Full-stack products, AI systems, and frontend work - each connected to a live build or GitHub repository.
            </p>
          </div>

          <div>
            <label htmlFor="project-search" className="sr-only">Search projects by name, category, or technology</label>
            <div className={`flex items-center rounded-xl border px-4 py-3 shadow-sm transition-colors focus-within:border-[#00786B] ${themeObj.card} ${themeObj.border}`}>
              <svg aria-hidden="true" className={`mr-3 h-5 w-5 shrink-0 ${themeObj.muted}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
              <input id="project-search" type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search React, AI, PostgreSQL..." className={`w-full bg-transparent outline-none ${themeObj.text}`} />
            </div>
            <p aria-live="polite" className={`mt-2 text-right text-xs ${themeObj.muted}`}>Showing {filteredProjects.length} {filteredProjects.length === 1 ? "project" : "projects"}</p>
          </div>
        </section>

        <nav className="mb-12 flex flex-wrap items-center gap-2 pt-5 md:mb-14" aria-label="Project sections">
          <span className={`mr-1 font-mono text-[10px] uppercase tracking-[0.18em] ${themeObj.muted}`}>Jump to</span>
          {projectSections.map((section, index) => (
            <a key={section.id} href={`#${section.id}`} className={`rounded-full border px-3 py-1.5 text-sm font-semibold ${themeObj.border} ${themeObj.buttonBg} ${themeObj.buttonText}`}>
              {String(index + 1).padStart(2, "0")}. {section.shortTitle}
            </a>
          ))}
        </nav>
        <div className="space-y-24 md:space-y-32">
          {visibleSections.map((section, sectionIndex) => (
            <section key={section.id} id={section.id} className="scroll-mt-8" aria-labelledby={`${section.id}-heading`}>
              <div className={`mb-9 flex flex-col justify-between gap-4 border-b pb-5 md:flex-row md:items-end ${themeObj.border}`}>
                <div>
                  <p className={`text-xs font-bold uppercase tracking-[0.18em] ${themeObj.accent}`}>{String(sectionIndex + 1).padStart(2, "0")}</p>
                  <h2 id={`${section.id}-heading`} className={`mt-2 text-3xl font-bold tracking-tight ${themeObj.text}`}>{section.title}</h2>
                  <p className={`mt-3 max-w-2xl leading-relaxed ${themeObj.muted}`}>{section.description}</p>
                </div>
                <p className={`shrink-0 font-mono text-sm ${themeObj.muted}`}>{section.projects.length} {section.projects.length === 1 ? "project" : "projects"}</p>
              </div>

              <div className="space-y-16 lg:space-y-24">
                {section.projects.map((project, index) => (
                  <EditorialProject key={project.slug} project={project} index={index} themeObj={themeObj} reduceMotion={reduceMotion} />
                ))}
              </div>
            </section>
          ))}
        </div>

        {visibleSections.length === 0 && (
          <div className={`rounded-2xl border p-10 text-center ${themeObj.card} ${themeObj.border}`}>
            <h2 className={`text-xl font-semibold ${themeObj.text}`}>No matching project</h2>
            <p className={`mt-2 ${themeObj.muted}`}>Try a technology such as React, TypeScript, AI, or Firebase.</p>
          </div>
        )}

        <footer className={`mt-28 border-t py-8 text-center text-sm ${themeObj.border} ${themeObj.muted}`}>
          Want to discuss one of these projects? <a className={themeObj.link} href="mailto:jaabirmahmud01@gmail.com">Email me</a>.
        </footer>
      </div>
    </main>
  );
}
