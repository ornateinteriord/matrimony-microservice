import React from 'react';
import { PageMetadata } from '../../types/seo';
import usePageMetadata from '../../hooks/usePageMetadata';

export const SEOHead: React.FC<PageMetadata> = (props) => {
  usePageMetadata(props);
  return null;
};

export default SEOHead;
