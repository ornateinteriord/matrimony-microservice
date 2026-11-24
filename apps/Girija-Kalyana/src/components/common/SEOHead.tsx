import React from "react";
import usePageMetadata from "../../hooks/usePageMetadata";
import { PageMetadata } from "../../types/seo";

export const SEOHead: React.FC<PageMetadata> = ({
  title,
  description,
  canonicalUrl,
  structuredData,
}) => {
  usePageMetadata({
    title,
    description,
    canonicalUrl,
    structuredData,
  });

  return null;
};

export default SEOHead;
