/**
 * Tier 2 Boundary Test Suite: F8 - Girija-Kalyana SEO & Error Boundaries
 * Verifies single h1 enforcement, multiple h1 rejection, invalid sitemaps, and missing robots directives.
 */

const {
  parseRobotsTxt,
  parseSitemapXml,
  analyzeHtmlMetadata
} = require('../helpers/seo-verifier');
const { assertOk, assertEqual } = require('../helpers/assertions');

module.exports = {
  id: 'F08-BVA',
  name: 'Girija-Kalyana SEO & Error Boundaries',
  tier: 'tier2',
  tests: [
    {
      name: 'TC-F08-B01: HTML analyzer rejects pages containing multiple <h1> tags',
      fn: async () => {
        const doubleH1Html = `
          <html><head><title>Test</title><meta name="description" content="Desc"/><link rel="canonical" href="https://example.com"/></head>
          <body><h1>Heading 1</h1><p>Text</p><h1>Heading 2</h1></body></html>
        `;
        const res = analyzeHtmlMetadata(doubleH1Html);
        assertEqual(res.valid, false, 'Multiple <h1> must be rejected');
        assertOk(res.errors.some(e => e.includes('exactly one <h1>')));
      }
    },
    {
      name: 'TC-F08-B02: HTML analyzer rejects pages with zero <h1> tags',
      fn: async () => {
        const noH1Html = `
          <html><head><title>Test</title><meta name="description" content="Desc"/><link rel="canonical" href="https://example.com"/></head>
          <body><h2>Only H2 Here</h2></body></html>
        `;
        const res = analyzeHtmlMetadata(noH1Html);
        assertEqual(res.valid, false, 'Zero <h1> must be rejected');
        assertOk(res.errors.some(e => e.includes('exactly one <h1>')));
      }
    },
    {
      name: 'TC-F08-B03: robots.txt parser rejects file without User-agent directive',
      fn: async () => {
        const invalidRobots = 'Disallow: /admin/\nSitemap: https://girijakalyana.com/sitemap.xml';
        const res = parseRobotsTxt(invalidRobots);
        assertEqual(res.valid, false, 'robots.txt without User-agent must be invalid');
      }
    },
    {
      name: 'TC-F08-B04: sitemap parser flags relative (non-absolute) URLs',
      fn: async () => {
        const invalidSitemap = `<?xml version="1.0"?>
          <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
            <url><loc>/relative-url-not-allowed</loc></url>
          </urlset>
        `;
        const res = parseSitemapXml(invalidSitemap);
        assertEqual(res.valid, false, 'Relative URLs in sitemap must be flagged');
      }
    },
    {
      name: 'TC-F08-B05: HTML analyzer rejects missing or empty meta description',
      fn: async () => {
        const missingDescHtml = `
          <html><head><title>Title</title><link rel="canonical" href="https://example.com"/></head>
          <body><h1>Heading</h1></body></html>
        `;
        const res = analyzeHtmlMetadata(missingDescHtml);
        assertEqual(res.valid, false, 'Missing description must be flagged');
      }
    }
  ]
};
