/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useContext } from "react";
import { motion } from "framer-motion";

import { ThemeContext } from "./ThemeProvider.jsx";

// --- Utility: Random Quote Generator ---
const QUOTES = [
  "Code is poetry.",
  "Simplicity is the soul of efficiency.",
  "Every interface tells a story.",
  "Creativity is intelligence having fun.",
  "Let's build something unforgettable.",
  "Good code is its own best documentation.",
  "First, solve the problem. Then, write the code.",
  "Make it work, make it right, make it fast.",
  "Programs must be written for people to read.",
  "In code, we trust.",
  "Think deeply, code simply.",
  "Less code, more impact.",
  "Design like you mean it.",
];

function getRandomQuote() {
  return QUOTES[Math.floor(Math.random() * QUOTES.length)];
}

// --- Main Portfolio Component ---
const ElegantPortfolio = () => {
  const { theme, setTheme, themes } = useContext(ThemeContext);
  const themeObj = themes[theme];

  // Section/scroll logic
  const [activeSection, setActiveSection] = useState("about");
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [quote] = useState(getRandomQuote());

  // Mouse tracking for spotlight
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Scroll event listener for active section
  useEffect(() => {
    const handleScroll = () => {
      // Get all sections
      const sections = document.querySelectorAll("section[id]");
      let current = "about"; // default to about

      // Find the section that is currently in view
      for (let i = 0; i < sections.length; i++) {
        const section = sections[i];
        const rect = section.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        // If the section is in the viewport
        if (
          rect.top <= windowHeight * 0.7 &&
          rect.bottom >= windowHeight * 0.3
        ) {
          current = section.id;
          break; // Use the first matching section
        }
      }

      setActiveSection(current);
    };

    // Attach scroll listener
    window.addEventListener("scroll", handleScroll);

    // Call once to set initial state
    handleScroll();

    // Cleanup
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
  };

  // --- Data ---
  const projects = [
    // Most impactful / AI-driven
    {
      name: "CareerByAI",
      desc: "An AI-powered youth career platform that generates personalized roadmaps, matches jobs, analyzes CVs, and curates learning resources using Google Gemini AI.",
      tags: [
        "React",
        "Node.js",
        "Express",
        "MongoDB",
        "Vercel",
        "Google Gemini AI",
        "PDF.js",
      ],
      github: "https://github.com/Jabirmahmud0/AI_career_Client",
      backend: "https://github.com/Jabirmahmud0/AI_career_Server",
      live: "https://careerbyai.vercel.app/",
      featured: true,
      image: "/CareerByAIImg.png",
    },

    // High-performance full-stack commerce platform
    {
      name: "CureBay",
      desc: "A full-stack healthcare e-commerce platform for medicines, lab tests, and online consultations with secure transactions and role-based dashboards.",
      tags: [
        "React",
        "Vite",
        "Tailwind",
        "Express",
        "MongoDB",
        "Stripe",
        "Firebase",
      ],
      github: "https://github.com/Jabirmahmud0/CureBay_Client",
      backend: "https://github.com/Jabirmahmud0/CureBay_Backend",
      live: "https://cure-bay-client.vercel.app/",
      featured: true,
      image: "/CureBay.png",
    },

    // Scalable modern web app (multi-purpose)
    {
      name: "FolioXe",
      desc: "A modern, versatile web app usable as an e-commerce platform, portfolio, dashboard, or SaaS product with full role management and secure payments.",
      tags: ["React", "Firebase", "Tailwind", "Vite", "Stripe"],
      github: "https://github.com/Jabirmahmud0/folioxe",
      live: "https://folioxe.vercel.app",
      featured: true,
      image: "/Folioxe.png",
      backend: "",
    },

    // Career and job matching platform
    {
      name: "NextTalent Job Platform",
      desc: "A job search and recruitment platform featuring resume building, job posting, application tracking, and real-time interview scheduling.",
      tags: [
        "React.js",
        "JavaScript",
        "Tailwind CSS",
        "Axios",
        "Socket.io",
        "Firebase",
      ],
      github: "https://github.com/Jabirmahmud0/NextTalent_Client",
      live: "https://next-talent-client.vercel.app",
      featured: false,
      image: "/next.png",
    },
  ];

  const experiences = [
    {
      title: "Frontend Developer",
      company: "Tech Solutions Inc.",
      period: "2022 — Present",
      description:
        "Build and maintain React applications for enterprise clients. Collaborate with design teams to implement pixel-perfect, responsive interfaces.",
    },
    {
      title: "Full Stack Developer",
      company: "Creative Agency",
      period: "2020 — 2022",
      description:
        "Developed custom web applications using modern JavaScript frameworks. Led frontend architecture decisions for multiple client projects.",
    },
    {
      title: "Junior Developer",
      company: "Startup Co.",
      period: "2019 — 2020",
      description:
        "Started my professional journey building features for a SaaS platform. Gained experience in agile development and version control.",
    },
  ];

  // Contact information can be added here if needed

  // --- Render ---
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <div
        className={`min-h-screen ${themeObj.bg} ${themeObj.text} selection:bg-teal-300 selection:text-teal-900 transition-colors duration-500`}
      >
        {/* Theme Switcher (uses ThemeProvider) */}
        <div className="fixed top-6 right-6 z-50 flex gap-2">
          {Object.keys(themes).map((t) => (
            <button
              key={t}
              onClick={() => setTheme(t)}
              className={`px-3 py-1 rounded-full font-bold text-xs border-2 transition-all ${
                theme === t
                  ? "border-teal-300 bg-slate-800 text-teal-300"
                  : "border-slate-700 bg-slate-900 text-slate-400 hover:border-teal-300 hover:text-teal-300"
              }`}
              aria-label={`Switch to ${themes[t].name} theme`}
            >
              {themes[t].name}
            </button>
          ))}
        </div>

        {/* global Spotlight is provided by ThemeProvider */}

        <div className="mx-auto min-h-screen max-w-screen-xl px-6 py-12 font-sans md:px-12 md:py-20 lg:px-24 lg:py-0">
          <div className="lg:flex lg:justify-between lg:gap-4">
            {/* Left Column - Fixed */}
            <header className="lg:sticky lg:top-0 lg:flex lg:max-h-screen lg:w-1/2 lg:flex-col lg:justify-between lg:py-24">
              <div>
                {/* Name & Title */}
                <div className="mb-8">
                  <h1
                    className={`text-4xl font-bold tracking-tight ${themeObj.text} sm:text-5xl`}
                  >
                    Jabir Mahmud
                  </h1>
                  <h2
                    className={`mt-3 text-lg font-medium tracking-tight ${themeObj.text} sm:text-xl`}
                  >
                    Software Engineer
                  </h2>
                  <p
                    className={`mt-4 max-w-xs leading-normal ${themeObj.muted}`}
                  >
                    I build pixel-perfect, engaging, and accessible digital
                    experiences.
                  </p>
                </div>
                {/* Navigation */}
                <nav
                  className="nav hidden lg:block"
                  aria-label="In-page jump links"
                >
                  <ul className="mt-16 w-max">
                    {["about", "skills", "projects", "contact"].map(
                      (section) => (
                        <li key={section}>
                          <button
                            onClick={() => scrollToSection(section)}
                            className={`group flex items-center py-3 ${
                              activeSection === section ? "active" : ""
                            }`}
                            aria-label={`Scroll to ${section} section`}
                          >
                            <span
                              className={`nav-indicator mr-4 h-px transition-all ${
                                activeSection === section
                                  ? themeObj.indicator + " w-16"
                                  : "w-8 bg-slate-600 group-hover:w-16 group-hover:" +
                                    themeObj.indicator
                              }`}
                            ></span>
                            <span
                              className={`nav-text text-xs font-bold uppercase tracking-widest transition-colors ${
                                activeSection === section
                                  ? themeObj.accent
                                  : themeObj.muted
                              }`}
                            >
                              {section}
                            </span>
                          </button>
                        </li>
                      )
                    )}
                  </ul>
                </nav>
              </div>
              {/* Social Links */}
              <div className="ml-1 mt-8">
                <a
                  href="/JabirCV.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center px-4 py-2 rounded-lg border ${
                    theme === "light"
                      ? "border-gray-300 text-gray-700 hover:bg-gray-50"
                      : "border-gray-600 text-gray-300 hover:bg-gray-800"
                  } font-medium transition-colors duration-300`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                  </svg>
                  View Resume
                </a>
              </div>
            </header>
            {/* Right Column - Scrollable Content */}
            <main className="pt-24 lg:w-1/2 lg:py-24">
              {/* About Section */}
              <section
                id="about"
                className="mb-16 scroll-mt-16 md:mb-24 lg:mb-36 lg:scroll-mt-24"
                aria-label="About me"
              >
                <div className="sticky top-0 z-20 -mx-6 mb-4 w-screen ${themeObj.nav} px-6 py-5 backdrop-blur md:-mx-12 md:px-12 lg:sr-only lg:relative lg:top-auto lg:mx-auto lg:w-full lg:px-0 lg:py-0 lg:opacity-0">
                  <h2
                    className={`text-sm font-bold uppercase tracking-widest ${themeObj.accent} lg:sr-only`}
                  >
                    About
                  </h2>
                </div>
                <div className="space-y-4">
                  {/* Profile image floated to the right */}
                  <div className="float-right ml-6 mb-4">
                    <img
                      src={
                        theme === "dark" ? "/jabir11.png" : "/jabir10.png"
                      }
                      alt="Jabir Mahmud"
                      className="rounded-lg w-32 h-auto object-contain border-2 border-teal-400/20 shadow-lg transition-transform duration-300 hover:scale-105 hover:border-teal-400/40 hover:shadow-xl"
                      loading="lazy"
                    />
                  </div>

                  <p>
                    I began by crafting small interfaces, but real growth came
                    when I started building platforms that solve real-world
                    problems. From basic websites to intelligent automation and
                    AI-driven systems, I shifted into full-stack development and
                    scalable architecture.
                  </p>
                  <p>
                    I’ve built high-impact{" "}
                    <a
                      href="#"
                      className={`font-medium ${themeObj.link} transition-colors`}
                      rel="noopener noreferrer"
                    >
                      healthcare platforms
                    </a>
                    ,{" "}
                    <a
                      href="#"
                      className={`font-medium ${themeObj.link} transition-colors`}
                      rel="noopener noreferrer"
                    >
                      AI-powered career systems
                    </a>
                    , and{" "}
                    <a
                      href="#"
                      className={`font-medium ${themeObj.link} transition-colors`}
                      rel="noopener noreferrer"
                    >
                      multi-purpose scalable applications
                    </a>
                    . These projects helped me master performance optimization,
                    seamless UI/UX, secure architecture, and deep integration
                    between front-end and back-end.
                  </p>
                  <p>
                    My current focus is developing{" "}
                    <span className={`font-medium ${themeObj.accent}`}>
                      intelligent, scalable, and high-performance
                    </span>{" "}
                    applications that leverage{" "}
                    <span className={`font-medium ${themeObj.accent}`}>AI</span>{" "}
                    and{" "}
                    <span className={`font-medium ${themeObj.accent}`}>
                      automation
                    </span>{" "}
                    to improve decision-making, efficiency, and overall user
                    impact. I architect systems that are optimized,
                    future-ready, and designed for real business use.
                  </p>
                  <p>
                    Outside of coding, I explore emerging technologies, refine
                    system design strategies, and study behavioral logic and
                    psychological optimization to build products that not only
                    work—but influence how people interact with technology.
                  </p>
                </div>
              </section>
              {/* Experience Section */}
              <section
  id="skills"
  className="mb-16 scroll-mt-16 md:mb-24 lg:mb-36 lg:scroll-mt-24"
  aria-label="Skills and expertise"
>
  <div className="sticky top-0 z-20 -mx-6 mb-4 w-screen bg-slate-900/75 px-6 py-5 backdrop-blur md:-mx-12 md:px-12 lg:sr-only lg:relative lg:top-auto lg:mx-auto lg:w-full lg:px-0 lg:py-0 lg:opacity-0">
    <h2 className="text-sm font-bold uppercase tracking-widest text-slate-200 lg:sr-only">
      Skills & Expertise
    </h2>
  </div>
  <div>
    <ol className="group/list">
      {/* Frontend Development */}
      <li className="mb-12">
        <div className="group relative grid pb-1 transition-all sm:grid-cols-8 sm:gap-8 md:gap-4 lg:hover:!opacity-100 lg:group-hover/list:opacity-50">
          <div className="absolute -inset-x-4 -inset-y-4 z-0 hidden rounded-md transition motion-reduce:transition-none lg:-inset-x-6 lg:block lg:group-hover:bg-slate-800/50"></div>
          <header className="z-10 mb-2 mt-1 text-xs font-semibold uppercase tracking-wide text-slate-500 sm:col-span-2">
            Frontend
          </header>
          <div className="z-10 sm:col-span-6">
            <h3 className="font-medium leading-snug text-slate-200 mb-3">
              Frontend Development
            </h3>
            <ul className="mt-2 text-sm leading-normal space-y-2">
              <li><span className="text-teal-300 font-medium">React.js</span> - Component-based UIs, Hooks, Context API</li>
              <li><span className="text-teal-300 font-medium">Next.js</span> - SSR, SSG, API routes</li>
              <li><span className="text-teal-300 font-medium">Tailwind CSS</span> - Responsive, utility-first styling</li>
              <li><span className="text-teal-300 font-medium">JavaScript (ES6+)</span> - Async/await, destructuring, modules</li>
            </ul>
          </div>
        </div>
      </li>

      {/* Backend Development */}
      <li className="mb-12">
        <div className="group relative grid pb-1 transition-all sm:grid-cols-8 sm:gap-8 md:gap-4 lg:hover:!opacity-100 lg:group-hover/list:opacity-50">
          <div className="absolute -inset-x-4 -inset-y-4 z-0 hidden rounded-md transition motion-reduce:transition-none lg:-inset-x-6 lg:block lg:group-hover:bg-slate-800/50"></div>
          <header className="z-10 mb-2 mt-1 text-xs font-semibold uppercase tracking-wide text-slate-500 sm:col-span-2">
            Backend
          </header>
          <div className="z-10 sm:col-span-6">
            <h3 className="font-medium leading-snug text-slate-200 mb-3">
              Backend Development
            </h3>
            <ul className="mt-2 text-sm leading-normal space-y-2">
              <li><span className="text-teal-300 font-medium">Node.js</span> - Scalable server-side applications</li>
              <li><span className="text-teal-300 font-medium">Express.js</span> - RESTful APIs, middleware, authentication</li>
              <li><span className="text-teal-300 font-medium">MongoDB</span> - Database design, aggregation, indexing</li>
              <li><span className="text-teal-300 font-medium">JWT Authentication</span> - Secure user sessions</li>
            </ul>
          </div>
        </div>
      </li>

      {/* Tools & Workflow */}
      <li className="mb-12">
        <div className="group relative grid pb-1 transition-all sm:grid-cols-8 sm:gap-8 md:gap-4 lg:hover:!opacity-100 lg:group-hover/list:opacity-50">
          <div className="absolute -inset-x-4 -inset-y-4 z-0 hidden rounded-md transition motion-reduce:transition-none lg:-inset-x-6 lg:block lg:group-hover:bg-slate-800/50"></div>
          <header className="z-10 mb-2 mt-1 text-xs font-semibold uppercase tracking-wide text-slate-500 sm:col-span-2">
            Tools
          </header>
          <div className="z-10 sm:col-span-6">
            <h3 className="font-medium leading-snug text-slate-200 mb-3">
              Development Tools & Workflow
            </h3>
            <ul className="mt-2 text-sm leading-normal space-y-2">
              <li><span className="text-teal-300 font-medium">Git & GitHub</span> - Version control, collaboration</li>
              <li><span className="text-teal-300 font-medium">VS Code</span> - Development environment optimization</li>
              <li><span className="text-teal-300 font-medium">Postman</span> - API testing and documentation</li>
              <li><span className="text-teal-300 font-medium">npm/yarn</span> - Package management</li>
            </ul>
          </div>
        </div>
      </li>

      {/* Specializations */}
      <li className="mb-12">
        <div className="group relative grid pb-1 transition-all sm:grid-cols-8 sm:gap-8 md:gap-4 lg:hover:!opacity-100 lg:group-hover/list:opacity-50">
          <div className="absolute -inset-x-4 -inset-y-4 z-0 hidden rounded-md transition motion-reduce:transition-none lg:-inset-x-6 lg:block lg:group-hover:bg-slate-800/50"></div>
          <header className="z-10 mb-2 mt-1 text-xs font-semibold uppercase tracking-wide text-slate-500 sm:col-span-2">
            Focus Areas
          </header>
          <div className="z-10 sm:col-span-6">
            <h3 className="font-medium leading-snug text-slate-200 mb-3">
              What I Specialize In
            </h3>
            <ul className="mt-2 text-sm leading-normal space-y-2">
              <li><span className="text-teal-300 font-medium">Full-Stack Web Apps</span> - End-to-end MERN development</li>
              <li><span className="text-teal-300 font-medium">AI Integration</span> - OpenAI, Google Gemini, automated workflows</li>
              <li><span className="text-teal-300 font-medium">System Architecture</span> - Scalable & role-based platforms</li>
              <li><span className="text-teal-300 font-medium">Responsive Design</span> - Mobile-first, cross-browser compatible</li>
              <li><span className="text-teal-300 font-medium">API Integration</span> - Third-party services, payment gateways</li>
              <li><span className="text-teal-300 font-medium">Performance Optimization</span> - Fast load times, efficient code</li>

            </ul>
          </div>
        </div>
      </li>
    </ol>
  </div>
</section>
              {/* Projects Section */}
              <section
                id="projects"
                className="mb-16 scroll-mt-16 md:mb-24 lg:mb-36 lg:scroll-mt-24"
                aria-label="Selected projects"
              >
                <div
                  className={`sticky top-0 z-20 -mx-6 mb-4 w-screen ${themeObj.nav} px-6 py-5 md:-mx-12 md:px-12 lg:sr-only lg:relative lg:top-auto lg:mx-auto lg:w-full lg:px-0 lg:py-0 lg:opacity-0`}
                >
                  <h2
                    className={`text-sm font-bold uppercase tracking-widest ${themeObj.accent} lg:sr-only`}
                  >
                    Projects
                  </h2>
                </div>
                <div>
                  <ol className="group/list">
                    {projects.map((project, index) => (
                      <motion.li
                        key={index}
                        className="mb-12"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                      >
                        <div className="group relative grid gap-4 pb-1 transition-all sm:grid-cols-8 sm:gap-8 md:gap-4 lg:hover:!opacity-100 lg:hover:-translate-y-1 lg:hover:shadow-lg lg:group-hover:list:opacity-100">
                          <div className="absolute -inset-x-4 -inset-y-4 z-0 hidden rounded-md motion-reduce:transition-none lg:-inset-x-6 lg:block bg-white/5 dark:bg-slate-800/50 border border-transparent lg:group-hover:border-slate-200/20 dark:lg:group-hover:border-slate-700/50 transition-all duration-300"></div>
                          <div className="z-10 sm:col-span-3">
                            <div
                              className={`rounded border-2 border-slate-200/10 transition-all duration-300 ${themeObj.card} overflow-hidden relative group`}
                            >
                              <a
                                href={project.live}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block h-full"
                              >
                                <div className="aspect-video w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 transition-all duration-300">
                                  <img
                                    src={project.image}
                                    alt={project.name}
                                    className="max-h-full max-w-full object-contain transition-all duration-300 group-hover:scale-110"
                                    loading="lazy"
                                  />
                                </div>
                              </a>
                            </div>
                          </div>
                          <div className="z-10 sm:col-span-5">
                            <div className="rounded transition-all duration-300 lg:group-hover:-translate-y-1">
                              <h3
                                className={`font-medium leading-snug ${themeObj.text}`}
                              >
                                <span
                                  className={`transition-colors duration-300 ${
                                    theme === "light"
                                      ? "group-hover:text-blue-600"
                                      : "group-hover:text-slate-400"
                                  }`}
                                >
                                  {project.name}
                                </span>
                              </h3>
                              <p
                                className={`mt-2 text-sm leading-normal ${
                                  themeObj.muted
                                } transition-colors duration-300 ${
                                  theme === "light"
                                    ? "group-hover:text-gray-900"
                                    : "group-hover:text-slate-400"
                                }`}
                              >
                                {project.desc}
                              </p>
                              <ul
                                className="mt-2 flex flex-wrap"
                                aria-label="Technologies used"
                              >
                                {project.tags.map((tag, tagIndex) => (
                                  <li key={tagIndex} className="mr-1.5 mt-2">
                                    <div
                                      className={`flex items-center rounded-full px-3 py-1 text-xs font-medium leading-5 transition-all duration-300 ${
                                        theme === "light"
                                          ? "group-hover:bg-blue-200"
                                          : "group-hover:bg-slate-700"
                                      } ${themeObj.tag}`}
                                    >
                                      {tag}
                                    </div>
                                  </li>
                                ))}
                              </ul>
                              <div className="mt-2 flex items-center gap-4">
                                <a
                                  href={project.live}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={`flex items-center transition-colors duration-300 ${themeObj.link}`}
                                  aria-label="Live Project"
                                >
                                  <svg
                                    className="h-5 w-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M10 6H6a2 2 0 00-2 2v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z"
                                    />
                                  </svg>
                                  <span className="ml-1">Live</span>
                                </a>
                                <a
                                  href={project.github}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={`flex items-center transition-colors duration-300 ${themeObj.link}`}
                                  aria-label="GitHub Repository"
                                >
                                  <svg
                                    className="h-5 w-5"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                  </svg>
                                  <span className="ml-1">Code</span>
                                </a>
                                {project.backend && (
                                  <a
                                    href={project.backend}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`flex items-center transition-colors duration-300 ${themeObj.link}`}
                                    aria-label="Backend Repository"
                                  >
                                    <svg
                                      className="h-5 w-5"
                                      fill="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        d="M2.4 10.8v8.4c0 1.2.8 2 2 2h15.2c1.2 0 2-.8 2-2v-8.4M12 13.6l9.6-2.8M12 13.6l-9.6-2.8M12 13.6v8.8M4 7.6l9.6 3.2 9.6-3.2c.8-.4.8-1.6 0-2L12.8 2.4c-.8-.4-2-.4-2.8 0L2.4 5.6c-.8.4-.8 1.6 0 2z"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        fill="none"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      />
                                    </svg>
                                    <span className="ml-1">Backend</span>
                                  </a>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </ol>
                  <div className="mt-12">
                    <motion.a
                      className="inline-flex items-center leading-tight text-teal-700 font-semibold group hover:text-teal-900 dark:text-teal-400 dark:hover:text-teal-300"
                      aria-label="View Full Project Archive"
                      href="/projects"
                      whileHover={{ x: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <span>
                        <span className="border-b border-transparent pb-px transition group-hover:border-teal-700 motion-reduce:transition-none dark:group-hover:border-teal-400">
                          View Full Project Archive
                        </span>
                        <span className="whitespace-nowrap">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            className="ml-1 inline-block h-4 w-4 shrink-0 transition-transform group-hover:translate-x-2 group-focus-visible:translate-x-2 motion-reduce:transition-none"
                            aria-hidden="true"
                          >
                            <path
                              fillRule="evenodd"
                              d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z"
                              clipRule="evenodd"
                            ></path>
                          </svg>
                        </span>
                      </span>
                    </motion.a>
                  </div>
                </div>
              </section>
              {/* Contact Section */}
              <section
                id="contact"
                className="mb-16 scroll-mt-16 md:mb-24 lg:mb-36 lg:scroll-mt-24"
                aria-label="Contact"
              >
                <div className="sticky top-0 z-20 -mx-6 mb-4 w-screen ${themeObj.nav} px-6 py-5 backdrop-blur md:-mx-12 md:px-12 lg:sr-only lg:relative lg:top-auto lg:mx-auto lg:w-full lg:px-0 lg:py-0 lg:opacity-0">
                  <h2
                    className={`text-sm font-bold uppercase tracking-widest ${themeObj.accent} lg:sr-only`}
                  >
                    Contact
                  </h2>
                </div>
                <div>
                  <p className={`mb-4 ${themeObj.text}`}>
                    I'm currently seeking new opportunities and would love to hear from you. Whether you have a project in mind, a question about my work, or just want to connect, I'll get back to you as soon as possible!
                  </p>
                  
                  {/* Contact Info Card with Get in Touch and Location */}
                  <div className={`mt-6 p-6 rounded-xl ${themeObj.card} border ${themeObj.border}`}>
                    <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
                      {/* Get in touch button */}
                      <div>
                        <h3 className={`text-lg font-semibold ${themeObj.text} mb-3`}>
                          Get in touch
                        </h3>
                        <a
                          href="mailto:jabirmahmud456@gmail.com"
                          className={`inline-flex items-center px-4 py-2 rounded-lg border ${
                            theme === "light"
                              ? "border-gray-300 text-gray-700 hover:bg-gray-50"
                              : "border-gray-600 text-gray-300 hover:bg-gray-800"
                          } font-medium transition-colors duration-300`}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 mr-2"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                          </svg>
                          Send email
                        </a>
                      </div>
                      
                      {/* Location */}
                      <div>
                        <h3 className={`text-lg font-semibold ${themeObj.text} mb-3`}>
                          Location
                        </h3>
                        <div className="flex items-start">
                          <div className="flex-shrink-0 p-2 rounded-lg bg-teal-500/10 mr-3">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 text-teal-500"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                          <p className={`${themeObj.muted} mt-0.5`}>
                            Dhaka, Bangladesh
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Let's Connect Card */}
                  <div className={`mt-6 p-6 rounded-xl ${themeObj.card} border ${themeObj.border}`}>
                    <h3 className={`text-lg font-semibold ${themeObj.text} mb-3`}>
                      Let's connect
                    </h3>
                    <p className={`mb-4 ${themeObj.muted}`}>
                      Connect with me on social media
                    </p>
                    <div className="flex space-x-4">
                      <a
                        href="https://github.com/Jabirmahmud0"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`p-3 rounded-lg ${theme === "light" ? "bg-gray-100 hover:bg-gray-200" : "bg-gray-800 hover:bg-gray-700"} transition-colors duration-300`}
                        aria-label="GitHub"
                      >
                        <svg
                          className="h-6 w-6"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                        </svg>
                      </a>
                      <a
                        href="https://x.com/Jabirmahmud0"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`p-3 rounded-lg ${theme === "light" ? "bg-gray-100 hover:bg-gray-200" : "bg-gray-800 hover:bg-gray-700"} transition-colors duration-300`}
                        aria-label="Twitter"
                      >
                        <svg
                          className="h-6 w-6"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.054 10.054 0 01-3.127 1.184 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                        </svg>
                      </a>
                      <a
                        href="https://www.linkedin.com/in/jabirmahmud0"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`p-3 rounded-lg ${theme === "light" ? "bg-gray-100 hover:bg-gray-200" : "bg-gray-800 hover:bg-gray-700"} transition-colors duration-300`}
                        aria-label="LinkedIn"
                      >
                        <svg
                          className="h-6 w-6"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              </section>
              
            </main>
          </div>
        </div>
        {/* Quote Generator */}
        <div
          class="fixed z-50 left-1/2 -translate-x-1/2 bottom-4 
         w-[90vw] max-w-xs text-center 
         sm:left-8 sm:translate-x-0 sm:text-left sm:max-w-md sm:w-auto sm:bottom-8 sm:text-base
         px-6 py-3 rounded-2xl 
         bg-gradient-to-br from-slate-800/70 to-slate-600/30 backdrop-blur-md 
         border border-slate-400/30 text-green-300 font-semibold 
         shadow-2xl 
         "
        >
          {quote}
        </div>
      </div>
    </ThemeContext.Provider>
  );
};

export default ElegantPortfolio;
