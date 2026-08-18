import { Link } from "react-router-dom";

export function ExternalIcon({ className = "h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" }) {
  return (
    <svg aria-hidden="true" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M14 5h5v5m0-5L10 14M19 13v6H5V5h6" />
    </svg>
  );
}

export function ArrowIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M3 10a.75.75 0 0 1 .75-.75h10.64L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.16-3.96H3.75A.75.75 0 0 1 3 10Z" clipRule="evenodd" />
    </svg>
  );
}

export function SectionHeading({ children, themeObj }) {
  return (
    <div className={`sticky top-0 z-20 -mx-6 mb-6 px-6 py-4 backdrop-blur md:-mx-12 md:px-12 lg:static lg:mx-0 lg:px-0 lg:py-0 ${themeObj.nav}`}>
      <h2 className={`text-sm font-bold uppercase tracking-[0.18em] ${themeObj.accent}`}>{children}</h2>
    </div>
  );
}

export function ProjectLinks({ project, themeObj }) {
  const deployments = project.deployments ?? [];

  return (
    <div className={`mt-4 flex flex-wrap items-center gap-x-4 gap-y-3 border-t pt-4 text-sm font-semibold ${themeObj.border}`}>
      {project.caseStudy && (
        <Link className={`group inline-flex items-center gap-1.5 ${themeObj.link}`} to={`/projects/${project.slug}`}>
          Case study <ArrowIcon />
        </Link>
      )}
      {deployments.map((deployment) => (
        <a key={deployment.url} className={`group inline-flex items-center gap-1.5 ${themeObj.link}`} href={deployment.url} target="_blank" rel="noopener noreferrer">
          {deployment.label} <ExternalIcon />
        </a>
      ))}
      {deployments.length === 0 && project.live && (
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
