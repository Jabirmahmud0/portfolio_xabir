import { motion as Motion } from "framer-motion";
import { SectionHeading } from "./PortfolioUI.jsx";
import { usePortfolioData } from "../PortfolioDataContext.js";

export function AboutSection({ reveal, theme, themeObj }) {
  const { sections } = usePortfolioData();
  const about = sections.about;
  return (
    <Motion.section {...reveal} id="about" className="mb-20 scroll-mt-20 md:mb-28" aria-labelledby="about-heading">
      <SectionHeading themeObj={themeObj}>About</SectionHeading>
      <div className="grid gap-7 sm:grid-cols-[1fr_128px] sm:items-start">
        <div className={`space-y-4 leading-relaxed ${themeObj.muted}`}>
          {about.paragraphs.map((paragraph, index) => <p key={paragraph} id={index === 0 ? "about-heading" : undefined} className={index === 0 ? themeObj.text : undefined}>{paragraph}</p>)}
        </div>
        <picture>
          <img
            src={theme === "dark" ? about.darkImage : about.lightImage}
            alt={sections.profile.name}
            width="128"
            height="160"
            fetchPriority="high"
            decoding="async"
            className="mx-auto rounded-xl border border-[#00786B]/25 object-cover shadow-lg transition-colors hover:border-[#00786B]/60 sm:mx-0"
          />
        </picture>
      </div>
    </Motion.section>
  );
}

export function SkillsSection({ reveal, themeObj }) {
  const { sections } = usePortfolioData();
  return (
    <Motion.section {...reveal} id="skills" className="mb-20 scroll-mt-20 md:mb-28" aria-labelledby="skills-heading">
      <SectionHeading themeObj={themeObj}>Skills</SectionHeading>
      <h2 id="skills-heading" className="sr-only">Skills and engineering capabilities</h2>
      <div className="space-y-9">
        {sections.skills.groups.map((group) => (
          <article key={group.label} className={`group -mx-3 grid gap-3 rounded-xl border border-transparent p-3 sm:grid-cols-[110px_1fr] ${themeObj.cardHover}`}>
            <p className={`text-xs font-bold uppercase tracking-[0.16em] ${themeObj.muted}`}>{group.label}</p>
            <div>
              <h3 className={`mb-3 font-semibold ${themeObj.text} ${themeObj.cardTitleHover}`}>{group.title}</h3>
              <ul className={`space-y-2 text-sm leading-relaxed ${themeObj.muted}`}>
                {group.items.map(({ name, detail }) => (
                  <li key={name}><strong className={`font-semibold ${themeObj.text}`}>{name}</strong> - {detail}</li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </div>
    </Motion.section>
  );
}

export function EducationSection({ reveal, themeObj }) {
  const { sections } = usePortfolioData();
  const education = sections.education;
  return (
    <Motion.section {...reveal} id="education" className="mb-20 scroll-mt-20 md:mb-28" aria-labelledby="education-heading">
      <SectionHeading themeObj={themeObj}>Education</SectionHeading>
      <h2 id="education-heading" className="sr-only">Education and certifications</h2>
      <div className={`group rounded-2xl border p-6 ${themeObj.card} ${themeObj.cardHover} ${themeObj.border}`}>
        <div className="flex flex-col justify-between gap-3 sm:flex-row">
          <div>
            <h3 className={`font-semibold ${themeObj.text} ${themeObj.cardTitleHover}`}>{education.degree}</h3>
            <p className={`mt-1 ${themeObj.muted}`}>{education.institution}</p>
          </div>
          <p className={`text-sm font-semibold ${themeObj.accent}`}>{education.graduation}</p>
        </div>
        <div className={`mt-6 border-t pt-5 ${themeObj.border}`}>
          <p className={`text-xs font-bold uppercase tracking-[0.16em] ${themeObj.muted}`}>{education.certificationLabel}</p>
          <ul className={`mt-3 space-y-2 text-sm ${themeObj.text}`}>
            {education.certifications.map((certification) => <li key={certification}>{certification}</li>)}
          </ul>
        </div>
      </div>
    </Motion.section>
  );
}
