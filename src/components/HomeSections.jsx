import { useReducedMotion } from "framer-motion";
import { AboutSection, EducationSection, SkillsSection } from "./HomeProfileSections.jsx";
import { ContactSection, ProjectsSection } from "./HomeWorkSections.jsx";

export default function HomeSections({ theme, themeObj }) {
  const reduceMotion = useReducedMotion();
  const reveal = reduceMotion ? {} : {
    initial: { opacity: 0, y: 14 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.15 },
    transition: { duration: 0.45 },
  };

  return (
    <div className="pt-20 lg:w-[54%] lg:py-24">
      <AboutSection reveal={reveal} theme={theme} themeObj={themeObj} />
      <SkillsSection reveal={reveal} themeObj={themeObj} />
      <EducationSection reveal={reveal} themeObj={themeObj} />
      <ProjectsSection reveal={reveal} themeObj={themeObj} />
      <ContactSection reveal={reveal} themeObj={themeObj} />
    </div>
  );
}
