import { useEffect } from 'react';
import { PageMetadata } from '../types/seo';

export const usePageMetadata = (metadata: PageMetadata) => {
  useEffect(() => {
    // 1. Set Title
    const formattedTitle = metadata.title.includes('Sangam Sathi')
      ? metadata.title
      : `${metadata.title} | Sangam Sathi`;
    document.title = formattedTitle;

    // 2. Set Meta Description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', metadata.description);

    // 3. Set Canonical Link
    const canonicalHref = metadata.canonicalUrl || window.location.href.split('?')[0];
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', canonicalHref);

    // 4. Structured Data (JSON-LD)
    const jsonLdId = 'seo-structured-data-jsonld';
    let scriptTag = document.getElementById(jsonLdId) as HTMLScriptElement | null;
    if (metadata.structuredData) {
      if (!scriptTag) {
        scriptTag = document.createElement('script');
        scriptTag.id = jsonLdId;
        scriptTag.type = 'application/ld+json';
        document.head.appendChild(scriptTag);
      }
      scriptTag.text = JSON.stringify(metadata.structuredData);
    } else if (scriptTag) {
      scriptTag.remove();
    }
  }, [metadata.title, metadata.description, metadata.canonicalUrl, metadata.structuredData]);
};

export default usePageMetadata;
