import { useEffect, useMemo, useState } from "react";
import { projects as fallbackProjects } from "./data/projects.js";
import { fallbackSections } from "./data/siteContent.js";
import { PortfolioDataContext } from "./PortfolioDataContext.js";

export default function PortfolioDataProvider({ children }) {
  const [content, setContent] = useState({
    projects: fallbackProjects,
    sections: fallbackSections,
    source: "static",
  });

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/content", { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error("Database content is unavailable.");
        return response.json();
      })
      .then((payload) => {
        setContent({
          projects: Array.isArray(payload.projects) && payload.projects.length ? payload.projects : fallbackProjects,
          sections: { ...fallbackSections, ...(payload.sections || {}) },
          source: "database",
        });
      })
      .catch((error) => {
        if (error.name !== "AbortError") setContent((current) => ({ ...current, source: "static" }));
      });
    return () => controller.abort();
  }, []);

  const value = useMemo(() => content, [content]);
  return <PortfolioDataContext.Provider value={value}>{children}</PortfolioDataContext.Provider>;
}
