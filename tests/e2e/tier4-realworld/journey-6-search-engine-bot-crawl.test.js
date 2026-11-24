/**
 * Tier 4 Real-World Scenario 6: Search Engine Bot Crawl Journey
 * Multi-step simulation of a search engine crawler indexing the site
 * inspecting REAL workspace files on disk (robots.txt, sitemap.xml, llm.txt, and App.tsx routes).
 */

const { readAppFile, appFileExists } = require('../helpers/workspace-resolver');
const {
  parseRobotsTxt,
  parseSitemapXml,
  parseLlmTxt
} = require('../helpers/seo-verifier');
const { assertOk, assertEqual } = require('../helpers/assertions');

module.exports = {
  id: 'JOURNEY-06',
  name: 'Search Engine Bot Crawl Journey',
  tier: 'tier4',
  tests: [
    {
      name: 'Scenario 6: Complete search engine bot discovery, sitemap crawl, and metadata audit',
      fn: async () => {
        // Step 1: Bot requests robots.txt from disk
        assertOk(appFileExists('Girija-Kalyana', 'public', 'robots.txt'), 'apps/Girija-Kalyana/public/robots.txt must exist');
        const robotsContent = readAppFile('Girija-Kalyana', 'public', 'robots.txt');
        const robotsRes = parseRobotsTxt(robotsContent);
        assertOk(robotsRes.valid, `robots.txt parse failed: ${robotsRes.errors.join('; ')}`);
        assertOk(robotsRes.sitemap && robotsRes.sitemap.includes('girijakalyana'), 'Sitemap directive must reference domain');

        // Step 2: Bot follows sitemap link from disk
        assertOk(appFileExists('Girija-Kalyana', 'public', 'sitemap.xml'), 'apps/Girija-Kalyana/public/sitemap.xml must exist');
        const sitemapContent = readAppFile('Girija-Kalyana', 'public', 'sitemap.xml');
        const sitemapRes = parseSitemapXml(sitemapContent);
        assertOk(sitemapRes.valid, `sitemap.xml parse failed: ${sitemapRes.errors.join('; ')}`);
        assertOk(sitemapRes.urlCount >= 3, 'Must find at least 3 URLs to crawl');

        // Step 3: Bot verifies that each crawled route corresponds to a route in App.tsx
        const appTsx = readAppFile('Girija-Kalyana', 'src', 'App.tsx');
        for (const targetUrl of sitemapRes.urls) {
          try {
            const urlObj = new URL(targetUrl);
            const pathname = urlObj.pathname === '/' ? '/' : urlObj.pathname.replace(/\/$/, '');
            if (pathname !== '/') {
              const routeSlug = pathname.replace(/^\//, '');
              assertOk(appTsx.includes(routeSlug), `App.tsx must define route for sitemap path: ${pathname}`);
            }
          } catch (e) {
            // Relative URL fallback check
            assertOk(appTsx.includes(targetUrl.replace(/^\//, '')), `App.tsx must define route for: ${targetUrl}`);
          }
        }

        // Step 4: Bot fetches llm.txt
        assertOk(appFileExists('Girija-Kalyana', 'public', 'llm.txt'), 'apps/Girija-Kalyana/public/llm.txt must exist');
        const llmContent = readAppFile('Girija-Kalyana', 'public', 'llm.txt');
        const llmRes = parseLlmTxt(llmContent);
        assertOk(llmRes.valid, `llm.txt parse failed: ${llmRes.errors.join('; ')}`);
      }
    }
  ]
};
