import { useEffect } from "react";

function upsertMeta(attribute, key, content) {
  let element = document.head.querySelector(`meta[${attribute}="${key}"]`);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.setAttribute("content", content);
}

export default function SEOHead({
  title = "Jabir Mahmud - Junior Software Engineer",
  description = "Portfolio of Jabir Mahmud, a junior software engineer building full-stack, frontend, and AI-powered applications with React, Next.js, and Node.js.",
  canonicalUrl = "https://jabir.pro.bd/",
  ogImage = "https://jabir.pro.bd/og-image.png",
  structuredData = null,
}) {
  useEffect(() => {
    document.title = title;
    upsertMeta("name", "title", title);
    upsertMeta("name", "description", description);
    upsertMeta("property", "og:type", "website");
    upsertMeta("property", "og:title", title);
    upsertMeta("property", "og:description", description);
    upsertMeta("property", "og:url", canonicalUrl);
    upsertMeta("property", "og:image", ogImage);
    upsertMeta("property", "og:image:alt", "Jabir Mahmud portfolio preview");
    upsertMeta("name", "twitter:card", "summary_large_image");
    upsertMeta("name", "twitter:title", title);
    upsertMeta("name", "twitter:description", description);
    upsertMeta("name", "twitter:url", canonicalUrl);
    upsertMeta("name", "twitter:image", ogImage);

    let canonical = document.head.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", canonicalUrl);

    const scriptId = "route-structured-data";
    let script = document.getElementById(scriptId);
    if (structuredData) {
      if (!script) {
        script = document.createElement("script");
        script.id = scriptId;
        script.type = "application/ld+json";
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(structuredData);
    } else if (script) {
      script.remove();
    }
  }, [canonicalUrl, description, ogImage, structuredData, title]);

  return null;
}
