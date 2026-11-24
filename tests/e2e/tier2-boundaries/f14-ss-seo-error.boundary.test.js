/**
 * Tier 2 Boundary Test Suite: F14 - Sangam-sathi SEO & Error Boundaries
 * Verifies missing canonical tags, empty titles, invalid robots inputs, and vite.svg favicon catches.
 */

const {
  parseRobotsTxt,
  parseSitemapXml,
  analyzeHtmlMetadata,
  detectFaviconDefects
} = require('../helpers/seo-verifier');
const { assertOk, assertEqual } = require('../helpers/assertions');

module.exports = {
  id: 'F14-BVA',
  name: 'Sangam-sathi SEO & Error Boundaries',
  tier: 'tier2',
  tests: [
    {
      name: 'TC-F14-B01: HTML analyzer flags document missing <link rel="canonical">',
      fn: async () => {
        const noCanonical = `
          <html><head><title>Title</title><meta name="description" content="Desc"/></head>
          <body><h1>Single H1</h1></body></html>
        `;
        const res = analyzeHtmlMetadata(noCanonical);
        assertEqual(res.valid, false, 'Missing canonical tag must fail validation');
        assertOk(res.errors.some(e => e.includes('canonical')));
      }
    },
    {
      name: 'TC-F14-B02: HTML analyzer flags document missing non-empty <title>',
      fn: async () => {
        const emptyTitle = `
          <html><head><title>   </title><meta name="description" content="Desc"/><link rel="canonical" href="https://example.com"/></head>
          <body><h1>Single H1</h1></body></html>
        `;
        const res = analyzeHtmlMetadata(emptyTitle);
        assertEqual(res.valid, false, 'Whitespace title must be invalid');
      }
    },
    {
      name: 'TC-F14-B03: robots.txt validator rejects non-absolute Sitemap directive',
      fn: async () => {
        const badRobots = 'User-agent: *\nSitemap: /relative-sitemap.xml';
        const res = parseRobotsTxt(badRobots);
        assertEqual(res.valid, false, 'Relative sitemap URL must fail');
      }
    },
    {
      name: 'TC-F14-B04: Parser returns error object safely when passed null or non-string inputs',
      fn: async () => {
        assertEqual(parseRobotsTxt(null).valid, false);
        assertEqual(parseSitemapXml(undefined).valid, false);
        assertEqual(analyzeHtmlMetadata({}).valid, false);
      }
    },
    {
      name: 'TC-F14-B05: Favicon validator flags default Vite template icon /vite.svg',
      fn: async () => {
        const badHtml = '<html><head><link rel="icon" type="image/svg+xml" href="/vite.svg" /></head></html>';
        const goodHtml = '<html><head><link rel="icon" type="image/x-icon" href="/favicon.ico" /></head></html>';
        const missingHtml = '<html><head><title>Title</title></head></html>';

        assertEqual(detectFaviconDefects(badHtml).valid, false, 'Must flag default vite.svg');
        assertEqual(detectFaviconDefects(goodHtml).valid, true, 'Must accept custom favicon');
        assertEqual(detectFaviconDefects(missingHtml).valid, false, 'Must flag missing favicon');
      }
    }
  ]
};
