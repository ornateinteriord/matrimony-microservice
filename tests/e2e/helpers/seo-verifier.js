/**
 * Technical SEO and metadata verification helpers for R4 / F8 / F14 / F20.
 * Validates:
 * - robots.txt syntax and directives
 * - sitemap.xml schema and canonical URLs
 * - llm.txt documentation file
 * - HTML string metadata (single h1, canonical tag, unique title, description)
 */

function parseRobotsTxt(content) {
  if (typeof content !== 'string') {
    return { valid: false, errors: ['Content must be a string'] };
  }

  const lines = content.split(/\r?\n/).map(l => l.trim()).filter(l => l && !l.startsWith('#'));
  const userAgents = [];
  const allows = [];
  const disallows = [];
  let sitemap = null;

  for (const line of lines) {
    const colonIdx = line.indexOf(':');
    if (colonIdx === -1) continue;
    const key = line.slice(0, colonIdx).trim().toLowerCase();
    const val = line.slice(colonIdx + 1).trim();

    if (key === 'user-agent') {
      userAgents.push(val);
    } else if (key === 'allow') {
      allows.push(val);
    } else if (key === 'disallow') {
      disallows.push(val);
    } else if (key === 'sitemap') {
      sitemap = val;
    }
  }

  const errors = [];
  if (userAgents.length === 0) {
    errors.push('robots.txt must specify at least one User-agent directive');
  }
  if (!sitemap) {
    errors.push('robots.txt must declare a Sitemap URL');
  } else if (!sitemap.startsWith('http://') && !sitemap.startsWith('https://')) {
    errors.push('Sitemap directive in robots.txt must be an absolute URL');
  }

  return {
    valid: errors.length === 0,
    errors,
    userAgents,
    allows,
    disallows,
    sitemap
  };
}

function parseSitemapXml(content) {
  if (typeof content !== 'string') {
    return { valid: false, errors: ['Sitemap content must be a string'] };
  }

  const errors = [];
  if (!content.includes('<?xml') && !content.includes('<urlset')) {
    errors.push('Sitemap must contain valid XML declaration or <urlset> root element');
  }

  const locRegex = /<loc>(.*?)<\/loc>/g;
  const urls = [];
  let match;
  while ((match = locRegex.exec(content)) !== null) {
    urls.push(match[1].trim());
  }

  if (urls.length === 0) {
    errors.push('Sitemap must contain at least one <loc> URL tag');
  } else {
    for (const url of urls) {
      if (!url.startsWith('https://') && !url.startsWith('http://')) {
        errors.push(`Non-absolute URL found in sitemap: ${url}`);
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    urlCount: urls.length,
    urls
  };
}

function parseLlmTxt(content) {
  if (typeof content !== 'string') {
    return { valid: false, errors: ['llm.txt content must be a string'] };
  }

  const errors = [];
  const requiredSections = [
    { name: 'System Overview or Platform Features', regex: /overview|matrimony|features|platform/i },
    { name: 'Architecture or System Foundation', regex: /architecture|foundation/i },
    { name: 'API Endpoints or Navigation Routes', regex: /routes|endpoints|navigation|api/i }
  ];

  for (const sec of requiredSections) {
    if (!sec.regex.test(content)) {
      errors.push(`llm.txt is missing required section matching: ${sec.name} (${sec.regex})`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    length: content.length
  };
}

function analyzeHtmlMetadata(htmlString) {
  if (typeof htmlString !== 'string') {
    return { valid: false, errors: ['HTML content must be a string'] };
  }

  const errors = [];

  // Check h1 count
  const h1Matches = htmlString.match(/<h1[^>]*>.*?<\/h1>/gi) || [];
  const h1Count = h1Matches.length;
  if (h1Count !== 1) {
    errors.push(`Page must contain exactly one <h1>, found: ${h1Count}`);
  }

  // Check title
  const titleMatch = htmlString.match(/<title[^>]*>(.*?)<\/title>/i);
  const title = titleMatch ? titleMatch[1].trim() : '';
  if (!title) {
    errors.push('Page is missing a non-empty <title> tag');
  }

  // Check meta description
  const metaDescMatch = htmlString.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["'][^>]*>/i);
  const description = metaDescMatch ? metaDescMatch[1].trim() : '';
  if (!description) {
    errors.push('Page is missing <meta name="description"> tag');
  }

  // Check canonical link
  const canonicalMatch = htmlString.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']*)["'][^>]*>/i);
  const canonicalUrl = canonicalMatch ? canonicalMatch[1].trim() : '';
  if (!canonicalUrl) {
    errors.push('Page is missing <link rel="canonical"> tag');
  } else if (!canonicalUrl.startsWith('http://') && !canonicalUrl.startsWith('https://')) {
    errors.push(`Canonical URL must be an absolute URL: ${canonicalUrl}`);
  }

  return {
    valid: errors.length === 0,
    errors,
    h1Count,
    title,
    description,
    canonicalUrl
  };
}

function detectFaviconDefects(html) {
  if (!html || typeof html !== 'string') return { valid: false, error: 'Empty input' };
  if (/href=['"][^'"]*vite\.svg['"]/i.test(html)) {
    return { valid: false, error: 'Forbidden default vite.svg favicon detected' };
  }
  if (!/rel=['"](?:icon|shortcut icon)['"]/i.test(html)) {
    return { valid: false, error: 'Missing favicon link tag' };
  }
  return { valid: true };
}

module.exports = {
  parseRobotsTxt,
  parseSitemapXml,
  parseLlmTxt,
  analyzeHtmlMetadata,
  detectFaviconDefects
};
