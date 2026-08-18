import { useContext, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { ThemeContext } from "../ThemeProvider.jsx";
import SEOHead from "./SEOHead.jsx";
import ThemeToggle from "./ThemeToggle.jsx";
import { ExternalIcon } from "./PortfolioUI.jsx";
import { usePortfolioData } from "../PortfolioDataContext.js";

function NotFound({ themeObj }) {
  return (
    <main className={`grid min-h-screen place-items-center px-6 ${themeObj.bg} ${themeObj.text}`}>
      <div className="text-center">
        <p className={`text-sm font-semibold uppercase tracking-[0.18em] ${themeObj.accent}`}>404</p>
        <h1 className="mt-3 text-3xl font-bold">Case study not found</h1>
        <Link to="/projects" className={`mt-6 inline-block font-semibold ${themeObj.link}`}>Return to projects</Link>
      </div>
    </main>
  );
}

export default function ProjectCaseStudy() {
  const { slug } = useParams();
  const { theme, themes } = useContext(ThemeContext);
  const themeObj = themes[theme];
  const { projects } = usePortfolioData();
  const project = projects.find((item) => item.slug === slug);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [slug]);

  if (!project?.caseStudy) return <NotFound themeObj={themeObj} />;

  const caseStudyProjects = projects.filter((item) => item.caseStudy);
  const caseStudyIndex = caseStudyProjects.findIndex((item) => item.slug === project.slug);
  const nextProject = caseStudyProjects.length > 1 ? caseStudyProjects[(caseStudyIndex + 1) % caseStudyProjects.length] : null;
  const deployments = project.deployments ?? [];
  const evidenceAvailable = [
    deployments.length ? `${deployments.length} live tenant deployments` : project.live ? "Live product" : null,
    project.github ? "public GitHub repository" : null,
    project.backend ? "backend repository" : null,
  ].filter(Boolean).join(" - ");

  return (
    <main className={`min-h-screen ${themeObj.bg} ${themeObj.text} transition-colors duration-300`}>
      <SEOHead title={`${project.name} Case Study - Jabir Mahmud`} description={`${project.desc} Read the engineering challenge, approach, implemented features, and verification links.`} canonicalUrl={`https://jabir.pro.bd/projects/${project.slug}`} />

      <div className="mx-auto max-w-5xl px-6 py-8 md:px-10 md:py-12">
        <header className="flex items-center justify-between gap-4">
          <Link to="/projects" className={`group inline-flex items-center gap-2 text-sm font-semibold ${themeObj.link}`}>
            <span aria-hidden="true" className="transition-transform group-hover:-translate-x-1">&larr;</span> Project archive
          </Link>
          <ThemeToggle />
        </header>

        <article className="pb-20 pt-16 md:pt-24">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
              <span className={`rounded-full px-3 py-1.5 ${themeObj.tag}`}>{project.status}</span>
              <span className={themeObj.muted}>{project.category}</span>
            </div>
            <h1 className={`mt-5 text-4xl font-bold tracking-tight md:text-6xl ${themeObj.text}`}>{project.name}</h1>
            <p className={`mt-6 text-lg leading-relaxed md:text-xl ${themeObj.muted}`}>{project.desc}</p>
            <div className="mt-7 flex flex-wrap gap-3">
              {deployments.map((deployment, index) => <a key={deployment.url} href={deployment.url} target="_blank" rel="noopener noreferrer" className={index === 0 ? `group inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors ${themeObj.primaryButton}` : `group inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-semibold ${themeObj.border} ${themeObj.buttonBg} ${themeObj.buttonText}`}>{deployment.label} <ExternalIcon /></a>)}
              {deployments.length === 0 && project.live && <a href={project.live} target="_blank" rel="noopener noreferrer" className={`group inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors ${themeObj.primaryButton}`}>Open live product <ExternalIcon /></a>}
              {project.github && <a href={project.github} target="_blank" rel="noopener noreferrer" className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-semibold ${themeObj.border} ${themeObj.buttonBg} ${themeObj.buttonText}`}>GitHub repository <ExternalIcon /></a>}
              {project.backend && <a href={project.backend} target="_blank" rel="noopener noreferrer" className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-semibold ${themeObj.border} ${themeObj.buttonBg} ${themeObj.buttonText}`}>Backend repository <ExternalIcon /></a>}
            </div>
          </div>

          <a href={project.live || deployments[0]?.url} target="_blank" rel="noopener noreferrer" aria-label={`Open ${project.name}`} className={`group mt-12 block overflow-hidden rounded-2xl border p-3 ${themeObj.border} ${themeObj.card} ${themeObj.cardHover} ${themeObj.media}`}>
            <img src={project.image} alt={`${project.name} product interface`} width="1200" height="750" decoding="async" className="aspect-[16/9] w-full object-contain transition-transform duration-500 group-hover:scale-[1.01]" />
          </a>

          <div className="mt-14 grid gap-10 md:grid-cols-[minmax(0,2fr)_minmax(220px,1fr)] md:gap-16">
            <div className="space-y-12">
              <section className="group" aria-labelledby="challenge-heading">
                <p className={`text-xs font-bold uppercase tracking-[0.18em] ${themeObj.accent}`}>01 - Challenge</p>
                <h2 id="challenge-heading" className={`mt-3 text-2xl font-bold ${themeObj.text} ${themeObj.cardTitleHover}`}>The engineering problem</h2>
                <p className={`mt-4 leading-8 ${themeObj.muted}`}>{project.caseStudy.challenge}</p>
              </section>

              <section className="group" aria-labelledby="approach-heading">
                <p className={`text-xs font-bold uppercase tracking-[0.18em] ${themeObj.accent}`}>02 - Approach</p>
                <h2 id="approach-heading" className={`mt-3 text-2xl font-bold ${themeObj.text} ${themeObj.cardTitleHover}`}>How I structured the solution</h2>
                <p className={`mt-4 leading-8 ${themeObj.muted}`}>{project.caseStudy.approach}</p>
              </section>

              <section className="group" aria-labelledby="implementation-heading">
                <p className={`text-xs font-bold uppercase tracking-[0.18em] ${themeObj.accent}`}>03 - Implementation</p>
                <h2 id="implementation-heading" className={`mt-3 text-2xl font-bold ${themeObj.text} ${themeObj.cardTitleHover}`}>What the project demonstrates</h2>
                <ul className="mt-5 space-y-4">
                  {project.caseStudy.highlights.map((highlight) => (
                    <li key={highlight} className={`flex gap-3 leading-7 ${themeObj.muted}`}>
                      <span aria-hidden="true" className={`mt-2 h-2 w-2 shrink-0 rounded-full ${themeObj.indicator}`} />
                      {highlight}
                    </li>
                  ))}
                </ul>
              </section>

              <section className="group" aria-labelledby="evidence-heading">
                <p className={`text-xs font-bold uppercase tracking-[0.18em] ${themeObj.accent}`}>04 - Evidence</p>
                <h2 id="evidence-heading" className={`mt-3 text-2xl font-bold ${themeObj.text} ${themeObj.cardTitleHover}`}>How the work can be verified</h2>
                <p className={`mt-4 leading-8 ${themeObj.muted}`}>{project.caseStudy.proof}</p>
              </section>
            </div>

            <aside className="md:sticky md:top-10 md:self-start">
              <div className={`group rounded-2xl border p-6 ${themeObj.card} ${themeObj.cardHover} ${themeObj.border}`}>
                <h2 className={`font-semibold ${themeObj.text} ${themeObj.cardTitleHover}`}>Technology</h2>
                <ul className="mt-4 flex flex-wrap gap-2">{project.tags.map((tag) => <li key={tag} className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${themeObj.tag}`}>{tag}</li>)}</ul>
                <div className={`mt-6 border-t pt-5 text-sm ${themeObj.border}`}>
                  <p className={`font-semibold ${themeObj.text}`}>Project status</p>
                  <p className={`mt-1 ${themeObj.muted}`}>{project.status}</p>
                  <p className={`mt-5 font-semibold ${themeObj.text}`}>Evidence available</p>
                  <p className={`mt-1 ${themeObj.muted}`}>{evidenceAvailable}</p>
                </div>
              </div>
            </aside>
          </div>

          <nav className={`mt-20 flex flex-col justify-between gap-5 border-t pt-8 sm:flex-row sm:items-center ${themeObj.border}`} aria-label="Case study navigation">
            {nextProject && <div><p className={`text-xs font-bold uppercase tracking-[0.16em] ${themeObj.muted}`}>Next case study</p><Link to={`/projects/${nextProject.slug}`} className={`mt-2 inline-block text-lg font-semibold ${themeObj.link}`}>{nextProject.name} &rarr;</Link></div>}
            <a href="mailto:jaabirmahmud01@gmail.com" className={`font-semibold ${themeObj.link}`}>Discuss this project</a>
          </nav>
        </article>
      </div>
    </main>
  );
}
