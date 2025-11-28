
import React, { createContext, useEffect, useState } from 'react';
import themes from './themeConstants';

const ThemeContext = createContext({ theme: 'light', setTheme: () => {}, themes });

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved === 'light' || saved === 'dark') return saved;
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
    }
    return 'light';
  });

  // mouse position for global spotlight
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    try {
      localStorage.setItem('theme', theme);
    } catch {
      /* ignore */
    }
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
  }, [theme]);

  // Track mouse position globally so the spotlight can be rendered site-wide
  useEffect(() => {
    const handleMouseMove = (e) => setMousePosition({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themes }}>
      {/* Render a global spotlight overlay so the blue hover/light follows the cursor across the whole site */}
      <div className="pointer-events-none fixed inset-0 z-30 transition duration-300" style={{ background: themes[theme].spotlight(mousePosition.x, mousePosition.y) }} />
      {children}
    </ThemeContext.Provider>
  );
}

export default ThemeProvider;
export { ThemeContext };
