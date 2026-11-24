/**
 * Tier 1 Test Suite: F8 - Girija-Kalyana SEO, Metadata & Error Handling
 * Inspects real workspace files on disk: robots.txt, sitemap.xml, llm.txt,
 * index.html metadata, and real NotFoundPage component routing.
 */

const { readAppFile, appFileExists } = require('../helpers/workspace-resolver');
const { parseRobotsTxt, parseSitemapXml, parseLlmTxt } = require('../helpers/seo-verifier');
const { assertOk } = require('../helpers/assertions');

module.exports = {
  id: 'F08',
  name: 'Girija-Kalyana SEO & Error Pages',
  tier: 'tier1',
  tests: [
    {
      name: 'TC-F08-01: robots.txt exists on disk with valid User-agent and Sitemap directive',
      fn: async () => {
        assertOk(appFileExists('Girija-Kalyana', 'public', 'robots.txt'), 'apps/Girija-Kalyana/public/robots.txt must exist on disk');
        const content = readAppFile('Girija-Kalyana', 'public', 'robots.txt');
        const res = parseRobotsTxt(content);
        assertOk(res.valid, `robots.txt parse errors: ${res.errors.join('; ')}`);
        assertOk(res.sitemap && res.sitemap.includes('girijakalyana'), 'Sitemap directive must reference domain');
      }
    },
    {
      name: 'TC-F08-02: sitemap.xml exists on disk with valid XML urlset and canonical URLs',
      fn: async () => {
        assertOk(appFileExists('Girija-Kalyana', 'public', 'sitemap.xml'), 'apps/Girija-Kalyana/public/sitemap.xml must exist on disk');
        const content = readAppFile('Girija-Kalyana', 'public', 'sitemap.xml');
        const res = parseSitemapXml(content);
        assertOk(res.valid, `sitemap.xml parse errors: ${res.errors.join('; ')}`);
        assertOk(res.urlCount >= 3, 'sitemap.xml must index at least 3 routes');
      }
    },
    {
      name: 'TC-F08-03: llm.txt exists on disk with System Overview, Architecture, and Endpoints',
      fn: async () => {
        assertOk(appFileExists('Girija-Kalyana', 'public', 'llm.txt'), 'apps/Girija-Kalyana/public/llm.txt must exist on disk');
        const content = readAppFile('Girija-Kalyana', 'public', 'llm.txt');
        const res = parseLlmTxt(content);
        assertOk(res.valid, `llm.txt parse errors: ${res.errors.join('; ')}`);
      }
    },
    {
      name: 'TC-F08-04: index.html defines unique title, viewport, and non-default favicon',
      fn: async () => {
        const html = readAppFile('Girija-Kalyana', 'index.html');
        assertOk(html.includes('<title>GirijaKalyana</title>') || html.includes('<title>Girija Kalyana'), 'Must declare branded title');
        assertOk(!html.includes('/vite.svg'), 'Must not link to default unbranded /vite.svg');
        assertOk(html.includes('rel="icon"'), 'Must declare favicon link');
      }
    },
    {
      name: 'TC-F08-05: Real 404 NotFound page component exists and is routed in App.tsx',
      fn: async () => {
        assertOk(appFileExists('Girija-Kalyana', 'src', 'components', 'notFound', 'NotFoundPage.tsx'), 'NotFoundPage.tsx must exist');
        const appTsx = readAppFile('Girija-Kalyana', 'src', 'App.tsx');
        assertOk(appTsx.includes('NotFoundPage'), 'App.tsx must import NotFoundPage');
        assertOk(/<Route\s+path=["']\*["']\s+element=\{<NotFoundPage\s*\/>\}/.test(appTsx), 'App.tsx must bind wildcard * route to NotFoundPage');
      }
    }
  ]
};
