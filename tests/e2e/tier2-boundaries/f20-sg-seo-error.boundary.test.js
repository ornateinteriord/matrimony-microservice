/**
 * Tier 2 Boundary Test Suite: F20 - Shree-ganda SEO & Error Boundaries
 * Verifies multiple h1 rejection, sitemap schema enforcement, and missing llm.txt sections.
 */

const {
  parseRobotsTxt,
  parseSitemapXml,
  parseLlmTxt,
  analyzeHtmlMetadata
} = require('../helpers/seo-verifier');
const { assertOk, assertEqual } = require('../helpers/assertions');

module.exports = {
  id: 'F20-BVA',
  name: 'Shree-ganda SEO & Error Boundaries',
  tier: 'tier2',
  tests: [
    {
      name: 'TC-F20-B01: HTML analyzer flags document containing three <h1> elements',
      fn: async () => {
        const tripleH1Html = `
          <html><head><title>Title</title><meta name="description" content="Desc"/><link rel="canonical" href="https://example.com"/></head>
          <body><h1>One</h1><h1>Two</h1><h1>Three</h1></body></html>
        `;
        const res = analyzeHtmlMetadata(tripleH1Html);
        assertEqual(res.valid, false, 'Triple <h1> must be rejected');
        assertEqual(res.h1Count, 3);
      }
    },
    {
      name: 'TC-F20-B02: Sitemap parser flags XML missing urlset tag or XML declaration',
      fn: async () => {
        const invalidXml = '<html><body>Not a sitemap</body></html>';
        const res = parseSitemapXml(invalidXml);
        assertEqual(res.valid, false, 'Invalid sitemap XML must fail');
      }
    },
    {
      name: 'TC-F20-B03: llm.txt parser flags document missing Architecture section',
      fn: async () => {
        const incompleteLlm = `
          # Overview
          System Overview content.
          ## Tech Stack
          Tech stack content.
          ## API Endpoints
          Endpoints content.
        `;
        const res = parseLlmTxt(incompleteLlm);
        assertEqual(res.valid, false, 'Missing Architecture section must fail');
      }
    },
    {
      name: 'TC-F20-B04: robots.txt parser rejects document missing Sitemap directive',
      fn: async () => {
        const robotsNoSitemap = 'User-agent: *\nAllow: /';
        const res = parseRobotsTxt(robotsNoSitemap);
        assertEqual(res.valid, false, 'Missing Sitemap in robots.txt must fail');
      }
    },
    {
      name: 'TC-F20-B05: Canonical URL validator rejects malformed protocol (ftp:// or non-web)',
      fn: async () => {
        const badProtocolHtml = `
          <html><head><title>Title</title><meta name="description" content="Desc"/><link rel="canonical" href="ftp://shreegandha.com"/></head>
          <body><h1>Heading</h1></body></html>
        `;
        const res = analyzeHtmlMetadata(badProtocolHtml);
        assertEqual(res.valid, false, 'Non-http(s) canonical URL must fail');
      }
    }
  ]
};
