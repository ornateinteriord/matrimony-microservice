import { useEffect } from "react";
import { PageMetadata } from "../types/seo";

export const usePageMetadata = ({
  title,
  description,
  canonicalUrl,
  structuredData,
}: PageMetadata) => {
  useEffect(() => {
    // 1. Update Document Title
    const formattedTitle = title.includes("Girija Kalyana")
      ? title
      : `${title} | Girija Kalyana Matrimony`;
    document.title = formattedTitle;

    // 2. Update / Create Meta Description
    let metaDescription = document.querySelector(
      'meta[name="description"]'
    ) as HTMLMetaElement | null;
    if (!metaDescription) {
      metaDescription = document.createElement("meta");
      metaDescription.name = "description";
      document.head.appendChild(metaDescription);
    }
    metaDescription.content = description;

    // 3. Update / Create Canonical Tag
    let linkCanonical = document.querySelector(
      'link[rel="canonical"]'
    ) as HTMLLinkElement | null;
    if (canonicalUrl) {
      if (!linkCanonical) {
        linkCanonical = document.createElement("link");
        linkCanonical.rel = "canonical";
        document.head.appendChild(linkCanonical);
      }
      linkCanonical.href = canonicalUrl;
    } else if (linkCanonical) {
      linkCanonical.remove();
    }

    // 4. Update / Create JSON-LD Structured Data
    let scriptJsonLd = document.querySelector(
      'script[data-schema="girija-seo"]'
    ) as HTMLScriptElement | null;

    if (structuredData) {
      if (!scriptJsonLd) {
        scriptJsonLd = document.createElement("script");
        scriptJsonLd.type = "application/ld+json";
        scriptJsonLd.setAttribute("data-schema", "girija-seo");
        document.head.appendChild(scriptJsonLd);
      }
      scriptJsonLd.text = JSON.stringify(structuredData);
    } else if (scriptJsonLd) {
      scriptJsonLd.remove();
    }

    return () => {
      // Optional cleanup
    };
  }, [title, description, canonicalUrl, structuredData]);
};

export default usePageMetadata;
