import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEOHead = ({ 
  title = "Jabir Mahmud - Software Engineer & Full-Stack Developer", 
  description = "Jabir Mahmud — Software Engineer & Full-Stack Developer from Dhaka, Bangladesh. Expert in React, Next.js, Node.js, TypeScript. View projects, skills, and contact.", 
  canonicalUrl = "https://jabir.pro.bd/", 
  ogImage = "https://jabir.pro.bd/og-image.png",
  structuredData = null
}) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      
      <link rel="canonical" href={canonicalUrl} />

      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={ogImage} />

      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:url" content={canonicalUrl} />
      <meta property="twitter:image" content={ogImage} />

      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};

export default SEOHead;
