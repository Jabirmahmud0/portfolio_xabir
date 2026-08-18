
import React, { createContext, useEffect, useRef, useState } from 'react';
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

  const spotlightRef = useRef(null);

  useEffect(() => {
    try {
      localStorage.setItem('theme', theme);
    } catch {
      /* ignore */
    }
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
  }, [theme]);

  useEffect(() => {
    let frameId;
    const updateSpotlight = (x, y) => {
      window.cancelAnimationFrame(frameId);
      frameId = window.requestAnimationFrame(() => {
        if (spotlightRef.current) {
          spotlightRef.current.style.background = themes[theme].spotlight(x, y);
        }
      });
    };

    const handleMouseMove = (event) => {
      updateSpotlight(event.clientX, event.clientY);
    };

    updateSpotlight(window.innerWidth / 2, window.innerHeight / 2);
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themes }}>
      <div
        ref={spotlightRef}
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-30 hidden lg:block"
        style={{ background: themes[theme].spotlight('50vw', '50vh') }}
      />
      {children}
    </ThemeContext.Provider>
  );
}

export default ThemeProvider;
export { ThemeContext };
