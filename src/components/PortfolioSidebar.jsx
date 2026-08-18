import { usePortfolioData } from "../PortfolioDataContext.js";
import ResumeMenu from "./ResumeMenu.jsx";

export default function PortfolioSidebar({ activeSection, navItems, themeObj }) {
  const { sections } = usePortfolioData();
  const profile = sections.profile;
  return (
    <header className="lg:sticky lg:top-0 lg:flex lg:max-h-screen lg:w-[46%] lg:flex-col lg:justify-between lg:py-24">
      <div>
        <p className={`mb-4 text-sm font-semibold uppercase tracking-[0.18em] ${themeObj.accent}`}>
          {profile.eyebrow}
        </p>
        <h1 className={`max-w-lg text-4xl font-bold tracking-tight sm:text-5xl ${themeObj.text}`}>{profile.name}</h1>
        <ul className={`mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-bold uppercase tracking-[0.13em] ${themeObj.accent}`} aria-label="Engineering focus areas">
          {profile.focusAreas.map((focus, index) => (
            <li key={focus} className="contents">
              {index > 0 && <span aria-hidden="true" className={themeObj.muted}>/</span>}
              <span>{focus}</span>
            </li>
          ))}
        </ul>
        <p className={`mt-5 max-w-md text-lg leading-relaxed ${themeObj.muted}`}>
          {profile.intro}
        </p>

        <div className={`mt-6 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm ${themeObj.border} ${themeObj.card}`}>
          <span aria-hidden="true" className="h-2 w-2 rounded-full bg-emerald-500" />
          {profile.availability}
        </div>

        <div className="mt-7 flex flex-wrap gap-3">
          <ResumeMenu themeObj={themeObj} label="View r?sum?" />
          <a href={`mailto:${profile.email}`} className={`inline-flex items-center rounded-lg border px-4 py-2.5 text-sm font-semibold ${themeObj.border} ${themeObj.buttonBg} ${themeObj.buttonText}`}>
            Email me
          </a>
        </div>

        <nav className="mt-14 hidden lg:block" aria-label="Portfolio sections">
          <ul className="w-max">
            {navItems.map((section) => (
              <li key={section}>
                <a href={`#${section}`} className="group flex items-center py-3">
                  <span className={`mr-4 h-px transition-all duration-200 ${activeSection === section ? `w-16 ${themeObj.indicator}` : "w-8 bg-neutral-500 group-hover:w-16 group-hover:bg-[#00786B]"}`} />
                  <span className={`text-xs font-bold uppercase tracking-[0.16em] transition-colors ${activeSection === section ? themeObj.accent : `${themeObj.muted} ${themeObj.navHover}`}`}>
                    {section}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className={`mt-10 flex flex-wrap gap-x-5 gap-y-3 text-sm font-semibold ${themeObj.muted}`}>
        {profile.socialLinks.map((link) => <a key={link.label} className={themeObj.link} href={link.url} target="_blank" rel="noopener noreferrer">{link.label}</a>)}
      </div>
    </header>
  );
}
