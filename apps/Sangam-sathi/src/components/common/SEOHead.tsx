import React from 'react';
import { PageMetadata } from '../../types/seo';
import usePageMetadata from '../../hooks/usePageMetadata';

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
