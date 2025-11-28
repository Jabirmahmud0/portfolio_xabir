import { useState, useContext } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { ThemeContext } from '../ThemeProvider.jsx';
import FolioxeImg from '../assets/Folioxe.png';
import CureBayImg from '../assets/CureBay.png';
import NextImg from '../assets/next.png';
import NebulaImg from '../assets/Nebula.png';
import OrbexaImg from '../assets/Orbexa.png';
import CozyImg from '../assets/Cozy.png';
import CareerByAIImg from '../assets/CareerByAIImg.png';
import ComfortImg from '../assets/Comfort.png';
import ArtLoopedImg from '../assets/ArtLooped.png';
import portfolioImg from '../assets/portfolio.png';
// Small carousel component for project photos
function ProjectCard({ project, themeObj }) {
  const photos = project.photos || [];
  const [index, setIndex] = useState(0);

  if (!photos.length) {
    // fallback: show a stylized placeholder with project initial
    return (
      <a
        href={project.live}
        target="_blank"
        rel="noopener noreferrer"
        className="block h-full w-full relative z-20 group floating"
      >
        <div className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-10 group-hover:opacity-25 transition-all duration-300`} />
        <div className="h-full min-h-[300px] flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 relative overflow-hidden">
          <div className="text-center p-6 transform transition-all duration-300 group-hover:scale-105">
            <div className={`text-6xl font-bold bg-gradient-to-br ${project.gradient} bg-clip-text text-transparent mb-2 transition-all duration-300`}>
              {project.name.charAt(0)}
            </div>
            <div className={`text-sm ${themeObj.muted} font-medium transition-all duration-300`}>
              {project.name}
            </div>
          </div>
        </div>
      </a>
    );
  }

  const prev = (e) => { e.stopPropagation(); setIndex((i) => (i - 1 + photos.length) % photos.length); };
  const next = (e) => { e.stopPropagation(); setIndex((i) => (i + 1) % photos.length); };

  return (
    <div className="w-full h-full flex">
      <a
        href={project.live}
        target="_blank"
        rel="noopener noreferrer"
        className="block relative w-full h-full group"
      >
        {/* blurred/color-extended background using the same photo to fill gaps */}
        <div
          aria-hidden
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url(${photos[index]})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(18px) saturate(120%)',
            transform: 'scale(1.08)'
          }}
        />

        <AnimatePresence mode="wait">
          <Motion.img
            key={index}
            src={photos[index]}
            alt={`${project.name} screenshot ${index+1}`}
            className="w-full h-full object-contain object-center cursor-pointer relative z-10 block"
            style={{ display: 'block' }}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            whileHover={{ scale: 1.02 }}
          />
        </AnimatePresence>

        {/* overlay shown on hover */}
        <Motion.div 
          className="pointer-events-none absolute inset-0 flex items-center justify-center z-10"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Motion.div 
            className="px-6 py-3 rounded-full bg-black/60 text-white text-sm backdrop-blur-md font-medium shadow-lg"
            initial={{ scale: 0.8, y: 10 }}
            whileHover={{ scale: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            View live
          </Motion.div>
        </Motion.div>
      </a>

      {/* controls */}
      {photos.length > 1 && (
        <>
          <Motion.button 
            onClick={prev} 
            aria-label="Previous" 
            className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full p-3 hover:bg-black/70 transition-all z-30 backdrop-blur-sm"
            whileHover={{ scale: 1.1, x: -2 }}
            whileTap={{ scale: 0.9 }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </Motion.button>
          <Motion.button 
            onClick={next} 
            aria-label="Next" 
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full p-3 hover:bg-black/70 transition-all z-30 backdrop-blur-sm"
            whileHover={{ scale: 1.1, x: 2 }}
            whileTap={{ scale: 0.9 }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </Motion.button>

          <div className="absolute left-1/2 -translate-x-1/2 bottom-4 flex gap-2 z-30">
            {photos.map((p, idx) => (
              <Motion.button 
                key={idx} 
                onClick={(e)=>{e.stopPropagation(); setIndex(idx);}} 
                className={`w-10 h-10 rounded-lg overflow-hidden border-2 ${idx===index? 'border-white shadow-lg scale-110': 'border-white/50'} bg-white/20 backdrop-blur-sm transition-all`}
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.95 }}
                animate={{ scale: idx === index ? 1.1 : 1 }}
              >
                    <img src={p} alt={`thumb-${idx}`} className="w-full h-full object-contain block" style={{ display: 'block' }} />
              </Motion.button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

const AllProjects = () => {
  const { theme, setTheme, themes } = useContext(ThemeContext);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const themeObj = themes[theme];
  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

  const projects = [
    // High-demand, industry-impact projects
    {
      "name": "CareerByAI",
      "desc": "An AI-powered youth career platform that generates personalized career roadmaps, matches jobs, analyzes CVs, and curates learning resources. Uses Google Gemini AI for intelligent guidance, aligned with UN SDG 8.",
      "tags": ["React", "Node.js", "Express", "MongoDB", "Vercel", "Google Gemini AI", "PDF.js"],
      "github": "https://github.com/Jabirmahmud0/AI_career_Client",
      "backend": "https://github.com/Jabirmahmud0/AI_career_Server",
      "live": "https://careerbyai.vercel.app/",
      "featured": true,
      "photos": [CareerByAIImg]
    },
    {
      "name": "CureBay",
      "desc": "A full-stack healthcare e-commerce platform for medicines, lab tests, and online consultations with role-based dashboards.",
      "tags": ["React", "Vite", "Tailwind", "Express", "MongoDB", "Stripe", "Firebase"],
      "github": "https://github.com/Jabirmahmud0/CureBay_Client",
      "backend": "https://github.com/Jabirmahmud0/CureBay_Backend",
      "live": "https://curebay.com",
      "featured": true,
      photos: [CureBayImg],
    },
    {
      name: "NextTalent Job Platform",
      desc: "A comprehensive career platform revolutionizing job search and talent management with intelligent matching and real-time updates.",
      tags: ["React.js", "JavaScript", "Tailwind CSS", "Firebase"],
      github: "https://github.com/Jabirmahmud0/NextTalent_Client",
      live: "https://next-talent-client.vercel.app",
      featured: true,
      category: "web",
      gradient: "from-blue-500 to-cyan-500",
      photos: [NextImg]
    },
  
    // Portfolio & personal branding
    {
      name: "Portfolio Website",
      desc: "A stunning, responsive portfolio template with smooth animations and modern UI/UX practices.",
      tags: ["Next.js", "TypeScript", "Framer Motion"],
      github: "https://github.com/Jabirmahmud0/portfolio_xabir",
      live: "https://jabir-chi.vercel.app/",
      featured: true,
      category: "web",
      gradient: "from-teal-500 to-emerald-500",
      photos: [portfolioImg]
    },
    {
      name: "FolioXe",
      desc: "A modern, versatile web application emphasizing performance, scalability, and clean UI.",
      tags: ["React", "Firebase", "Tailwind"],
      github: "https://github.com/Jabirmahmud0/folioxe",
      live: "https://folioxe.vercel.app",
      featured: true,
      category: "web",
      gradient: "from-purple-500 to-pink-500",
      photos: [FolioxeImg]
    },
  
    // Commercial-style applications
    {
      name: "Comfort Inn (Hotel Booking App)",
      desc: "Hotel booking application with interactive maps, personalized booking dashboard, dark/light mode, and secure auth.",
      tags: ["React", "Vite", "TailwindCSS", "Firebase", "Leaflet"],
      github: "https://github.com/Jabirmahmud0/comfortin",
      live: "https://comfortin-five.vercel.app",
      featured: true,
      category: "web",
      gradient: "from-amber-500 to-rose-500",
      photos: [ComfortImg]
    },
    {
      name: "CozyFind (Real Estate App)",
      desc: "Real estate web application with advanced property search, wishlist functionality, and responsive interface.",
      tags: ["React", "Vite", "TailwindCSS", "Firebase", "React Router"],
      github: "https://github.com/Jabirmahmud0/CozyFind",
      live: "https://cozy-find.vercel.app/",
      featured: true,
      category: "web",
      gradient: "from-emerald-500 to-teal-400",
      photos: [CozyImg]
    },
  
    // Creative marketing / interactive
    {
      name: "Neon 3D Marketing Site",
      desc: "Static marketing website with neon 3D visuals, responsive layout, and animated UI components.",
      tags: ["HTML5", "CSS3", "JavaScript", "jQuery", "Responsive Design"],
      github: "https://github.com/Jabirmahmud0/Nebula_Marketing",
      live: "https://nebula-marketing.vercel.app/",
      featured: false,
      category: "web",
      gradient: "from-pink-500 to-cyan-400",
      photos: [NebulaImg]
    },
  
    // Standard projects (low priority)
    {
      name: "OrBexa (E-Commerce Website)",
      desc: "Architectural e-commerce website with elegant animations and complete product system.",
      tags: ["HTML5", "CSS3", "JavaScript", "Lottie Animations", "E-Commerce"],
      github: "https://github.com/Jabirmahmud0/OrBexa_ECommerce",
      live: "https://orbexaecommerce.vercel.app",
      featured: false,
      category: "web",
      gradient: "from-gray-800 to-blue-400",
      photos: [OrbexaImg]
    },
  
 
  ];
  
  const categories = ["all", "web", "productivity", "lifestyle"];
  
  const normalizedSearch = search.trim().toLowerCase();

  const filteredProjects = projects.filter((p) => {
    // If there's an active search, ignore the category filter and search across all projects
    if (normalizedSearch) {
      const inName = p.name.toLowerCase().includes(normalizedSearch);
      const inDesc = (p.desc || '').toLowerCase().includes(normalizedSearch);
      const inTags = (p.tags || []).some(t => t.toLowerCase().includes(normalizedSearch));
      return inName || inDesc || inTags;
    }

    // Otherwise, apply category filtering as before
    if (filter !== 'all' && p.category !== filter) return false;

    return true;
  });

  return (
    <div className={`min-h-screen ${themeObj.bg} transition-all duration-500`}>
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <Motion.div
          className={`absolute -top-40 -right-40 w-80 h-80 ${theme === 'light' ? 'bg-teal-200' : 'bg-teal-800'} rounded-full opacity-20 blur-3xl`}
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <Motion.div
          className={`absolute -bottom-40 -left-40 w-80 h-80 ${theme === 'light' ? 'bg-blue-200' : 'bg-blue-800'} rounded-full opacity-20 blur-3xl`}
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [90, 0, 90],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

  <div className="container mx-auto px-8 md:px-16 lg:px-32 xl:px-48 py-8 md:py-12 relative z-10">
        {/* Header */}
        <Motion.div 
          className="flex justify-between items-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <a href="/" className={`flex items-center ${themeObj.link} font-semibold group transition-all`}>
            <Motion.svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform" 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </Motion.svg>
            Back to Portfolio
          </a>
          <Motion.button 
            onClick={toggleTheme}
            className={`p-3 rounded-xl ${themeObj.buttonBg} ${themeObj.buttonText} shadow-lg transition-all`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Toggle theme"
          >
            <AnimatePresence mode="wait">
              {theme === 'light' ? (
                <Motion.svg
                  key="moon"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5" 
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                >
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </Motion.svg>
              ) : (
                <Motion.svg
                  key="sun"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5" 
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                >
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707a1 1 0 001.414 0zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                </Motion.svg>
              )}
            </AnimatePresence>
          </Motion.button>
        </Motion.div>
        
        {/* Title Section */}
        <Motion.div 
          className="mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h1 className={`text-5xl md:text-6xl font-bold mb-4 ${themeObj.text}`}>
            <span className={`bg-gradient-to-r ${themeObj.gradientText} bg-clip-text text-transparent`}>
              Project Archive
            </span>
          </h1>
          <p className={`text-lg md:text-xl ${themeObj.muted} max-w-2xl mx-auto`}>
            A curated collection of my work, experiments, and creative explorations
          </p>
        </Motion.div>

        {/* Filter Tabs + Search */}
        <Motion.div 
          className="flex flex-col md:flex-row items-center justify-center mb-12 gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((cat) => (
              <Motion.button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-6 py-2.5 rounded-full font-medium transition-all ${
                  filter === cat
                    ? `bg-gradient-to-r ${themeObj.gradientButton} text-white shadow-lg`
                    : `${themeObj.buttonBg} ${themeObj.buttonText} border ${themeObj.border}`
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </Motion.button>
            ))}
          </div>

          {/* small search input */}
          <div className="flex items-center gap-2 ml-0 md:ml-6">
            <label htmlFor="project-search" className="sr-only">Search projects</label>
            <div className={`flex items-center px-3 py-2 rounded-full border ${themeObj.border} ${themeObj.buttonBg} ${themeObj.buttonText} shadow-sm`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1116.65 6.65a7.5 7.5 0 010 10.6z" />
              </svg>
              <input
                id="project-search"
                type="text"
                inputMode="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search"
                className={`bg-transparent outline-none appearance-none text-sm placeholder-slate-400 ${themeObj.text} w-36`}
              />
              {search && (
                <button onClick={() => setSearch('')} aria-label="Clear search" className="ml-2 text-slate-400 hover:text-slate-600">
                  ✕
                </button>
              )}
            </div>
          </div>
        </Motion.div>
        
        {/* Projects Grid */}
        <div className="space-y-8 will-change-transform">
          <AnimatePresence mode="wait">
            {filteredProjects.map((project) => (
              <Motion.div
                key={project.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.28, ease: 'easeInOut' }}
                className={`${themeObj.card} ${themeObj.cardHover} border ${themeObj.border} rounded-2xl overflow-hidden shadow-xl transition-all duration-300 group will-change-transform`}
                whileHover={{ y: -5 }}
              >
                <div className="flex flex-col md:flex-row items-stretch h-full">
                  {/* Project Details */}
                  <div className="p-8 md:w-2/3 flex flex-col justify-center shrink-0">
                    <div className="flex items-center gap-3 mb-4">
                      {project.featured && (
                        <span className={`px-3 py-1 bg-gradient-to-r ${themeObj.featuredTag} text-white text-xs font-bold rounded-full shadow-md`}>
                          ⭐ Featured
                        </span>
                      )}
                      <span className={`px-3 py-1 ${themeObj.tag} text-xs font-semibold rounded-full`}>
                        {project.category}
                      </span>
                    </div>
                    
                    <h3 className={`text-3xl font-bold mb-4 ${themeObj.text} ${themeObj.titleHover} transition-all`}>
                      {project.name}
                    </h3>
                    
                    <p className={`mb-6 text-base leading-relaxed ${themeObj.muted}`}>
                      {project.desc}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mb-6">
                      {project.tags.map((tag, tagIndex) => (
                        <Motion.span
                          key={tagIndex}
                          className={`${themeObj.tag} text-xs px-4 py-2 rounded-lg font-semibold shadow-sm`}
                          whileHover={{ scale: 1.05 }}
                        >
                          {tag}
                        </Motion.span>
                      ))}
                    </div>
                    
                    <div className="flex flex-wrap gap-4">
                      <Motion.a
                        href={project.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center ${themeObj.link} font-semibold transition-all group/link`}
                        whileHover={{ x: 5 }}
                      >
                        <svg
                          className="h-5 w-5 mr-2 group-hover/link:rotate-45 transition-transform"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                          />
                        </svg>
                        Live Demo
                      </Motion.a>
                      
                      <Motion.a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center ${themeObj.link} font-semibold transition-all`}
                        whileHover={{ x: 5 }}
                      >
                        <svg
                          className="h-5 w-5 mr-2"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                        </svg>
                        Source Code
                      </Motion.a>
                    </div>
                  </div>
                  
                  {/* Project Image / Photos Carousel */}
                  <div className="md:w-1/3 w-full relative overflow-hidden flex items-stretch shrink-0">
                    <div className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-20 group-hover:opacity-30 transition-opacity pointer-events-none z-0`} />
                    <ProjectCard project={project} themeObj={themeObj} />
                  </div>
                </div>
              </Motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Footer Stats */}
        <Motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <p className={`${themeObj.muted} text-sm`}>
            Showing {filteredProjects.length} of {projects.length} projects
          </p>
        </Motion.div>
      </div>
    </div>
  );
};

export default AllProjects;