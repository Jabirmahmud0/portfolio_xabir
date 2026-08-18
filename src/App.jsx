import { useContext, useEffect, useState } from "react";
import { ThemeContext } from "./ThemeProvider.jsx";
import SEOHead from "./components/SEOHead.jsx";
import ThemeToggle from "./components/ThemeToggle.jsx";
import PortfolioSidebar from "./components/PortfolioSidebar.jsx";
import HomeSections from "./components/HomeSections.jsx";
import { usePortfolioData } from "./PortfolioDataContext.js";

const navItems = ["about", "skills", "education", "projects", "contact"];

export default function Portfolio() {
  const { theme, themes } = useContext(ThemeContext);
  const themeObj = themes[theme];
  const [activeSection, setActiveSection] = useState("about");
  const { sections } = usePortfolioData();
  const site = sections.site;

  useEffect(() => {
    const sections = navItems.map((id) => document.getElementById(id)).filter(Boolean);
    let frameId;

    const updateActiveSection = () => {
      window.cancelAnimationFrame(frameId);
      frameId = window.requestAnimationFrame(() => {
        const atPageEnd = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 4;
        if (atPageEnd) {
          setActiveSection(sections.at(-1)?.id ?? "contact");
          return;
        }

        const activationLine = window.innerHeight * 0.35;
        let currentSection = sections[0]?.id ?? "about";

        for (const section of sections) {
          if (section.getBoundingClientRect().top <= activationLine) currentSection = section.id;
          else break;
        }

        setActiveSection(currentSection);
      });
    };

    updateActiveSection();
    window.addEventListener("scroll", updateActiveSection, { passive: true });
    window.addEventListener("resize", updateActiveSection);
    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("scroll", updateActiveSection);
      window.removeEventListener("resize", updateActiveSection);
    };
  }, []);

  return (
    <>
      <SEOHead
        title={site.title}
        description={site.description}
        canonicalUrl={site.canonicalUrl}
      />
      <main id="main-content" className={`min-h-screen ${themeObj.bg} ${themeObj.text} selection:bg-[#00786B] selection:text-white transition-colors duration-300`}>
        <a href="#about" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-[#00786B] focus:px-4 focus:py-2 focus:text-white">Skip to content</a>
        <div className="fixed right-5 top-5 z-50 md:right-8 md:top-8"><ThemeToggle /></div>
        <div className="mx-auto min-h-screen max-w-screen-xl px-6 py-12 font-sans md:px-12 md:py-20 lg:px-24 lg:py-0">
          <div className="lg:flex lg:justify-between lg:gap-10">
            <PortfolioSidebar activeSection={activeSection} navItems={navItems} themeObj={themeObj} />
            <HomeSections theme={theme} themeObj={themeObj} />
          </div>
        </div>
      </main>
    </>
  );
}
