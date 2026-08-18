import { motion as Motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowIcon, ExternalIcon, ProjectLinks, SectionHeading } from "./PortfolioUI.jsx";
import { usePortfolioData } from "../PortfolioDataContext.js";
import ResumeMenu from "./ResumeMenu.jsx";

export function ProjectsSection({ reveal, themeObj }) {
  const { projects } = usePortfolioData();
  const homepageProjects = projects.filter((project) => project.homepage);
  return (
    <Motion.section {...reveal} id="projects" className="mb-20 scroll-mt-20 md:mb-28" aria-labelledby="projects-heading">
      <SectionHeading themeObj={themeObj}>Selected work</SectionHeading>
      <h2 id="projects-heading" className="sr-only">Selected projects</h2>
      <div className="space-y-5">
        {homepageProjects.map((project) => (
          <article key={project.slug} className={`group overflow-hidden rounded-2xl border ${themeObj.card} ${themeObj.cardHover} ${themeObj.border}`}>
            <div className="grid md:grid-cols-[minmax(190px,2fr)_minmax(0,3fr)]">
              <a
                href={project.live || project.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Open ${project.name}`}
                className={`flex aspect-[16/10] items-center justify-center overflow-hidden p-4 md:aspect-auto md:min-h-64 ${themeObj.media}`}
              >
                <img
                  src={project.image}
                  srcSet={`${project.image.replace(/\.webp$/i, "-card.webp")} 1280w, ${project.image} 2560w`}
                  sizes="(min-width: 768px) 38vw, calc(100vw - 3rem)"
                  alt={`${project.name} interface`}
                  width="640"
                  height="400"
                  loading="lazy"
                  decoding="async"
                  className={`h-full max-h-56 w-full rounded-lg border object-contain shadow-sm transition-transform duration-500 group-hover:scale-[1.02] ${themeObj.border}`}
                />
              </a>
              <div className={`border-t p-5 md:border-l md:border-t-0 ${themeObj.border}`}>
                <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
                  <span className={`rounded-full px-2.5 py-1 ${themeObj.tag}`}>{project.status}</span>
                  <span className={themeObj.muted}>{project.category}</span>
                </div>
                <h3 className={`mt-3 text-lg font-semibold leading-snug ${themeObj.text} ${themeObj.cardTitleHover}`}>{project.name}</h3>
                <p className={`mt-2 text-sm leading-relaxed ${themeObj.muted}`}>{project.desc}</p>
                <ul className="mt-3 flex flex-wrap gap-2" aria-label="Technologies used">
                  {project.tags.slice(0, 4).map((tag) => <li key={tag} className={`rounded-full px-2.5 py-1 text-xs font-medium ${themeObj.tag}`}>{tag}</li>)}
                </ul>
                <ProjectLinks project={project} themeObj={themeObj} />
              </div>
            </div>
          </article>
        ))}
      </div>
      <Link to="/projects" className={`group mt-8 inline-flex items-center gap-2 font-semibold ${themeObj.link}`}>
        Explore all projects <ArrowIcon />
      </Link>
    </Motion.section>
  );
}

export function ContactSection({ reveal, themeObj }) {
  const { sections } = usePortfolioData();
  const { contact, profile } = sections;
  return (
    <Motion.section {...reveal} id="contact" className="scroll-mt-20 pb-20" aria-labelledby="contact-heading">
      <SectionHeading themeObj={themeObj}>Contact</SectionHeading>
      <div className={`group rounded-2xl border p-7 ${themeObj.card} ${themeObj.cardHover} ${themeObj.border}`}>
        <p className={`text-sm font-semibold uppercase tracking-[0.16em] ${themeObj.accent}`}>{contact.kicker}</p>
        <h2 id="contact-heading" className={`mt-3 text-2xl font-bold ${themeObj.text} ${themeObj.cardTitleHover}`}>{contact.headline}</h2>
        <p className={`mt-3 max-w-xl leading-relaxed ${themeObj.muted}`}>
          {contact.body}
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a href={`mailto:${profile.email}`} className={`rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors ${themeObj.primaryButton}`}>{profile.email}</a>
          <a href={profile.socialLinks.find((link) => link.label === "LinkedIn")?.url} target="_blank" rel="noopener noreferrer" className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-semibold ${themeObj.border} ${themeObj.buttonBg} ${themeObj.buttonText}`}>
            LinkedIn <ExternalIcon />
          </a>
          <ResumeMenu themeObj={themeObj} label="View role-specific resumes" variant="secondary" />
        </div>
        <p className={`mt-6 text-sm ${themeObj.muted}`}>{contact.locationLine}</p>
      </div>
    </Motion.section>
  );
}