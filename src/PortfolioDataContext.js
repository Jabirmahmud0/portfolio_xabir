import { createContext, useContext } from "react";
import { projects as fallbackProjects } from "./data/projects.js";
import { fallbackSections } from "./data/siteContent.js";

export const PortfolioDataContext = createContext({
  projects: fallbackProjects,
  sections: fallbackSections,
  source: "static",
});

export function usePortfolioData() {
  return useContext(PortfolioDataContext);
}
