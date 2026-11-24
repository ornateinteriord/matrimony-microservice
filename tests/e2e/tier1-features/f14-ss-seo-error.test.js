/**
 * Tier 1 Test Suite: F14 - Sangam-sathi SEO, Favicon & Error Handling
 * Inspects real workspace files on disk: robots.txt, sitemap.xml, llm.txt,
 * index.html favicon/title, and real NotFoundPage component routing.
 */

const { readAppFile, appFileExists } = require('../helpers/workspace-resolver');
const { parseRobotsTxt, parseSitemapXml, parseLlmTxt } = require('../helpers/seo-verifier');
const { assertOk } = require('../helpers/assertions');

module.exports = {
  id: 'F14',
  name: 'Sangam-sathi SEO & Error Pages',
  tier: 'tier1',
  tests: [
    {
      name: 'TC-F14-01: robots.txt exists on disk with valid User-agent and Sitemap directive for Sangam-sathi',
      fn: async () => {
        assertOk(appFileExists('Sangam-sathi', 'public', 'robots.txt'), 'apps/Sangam-sathi/public/robots.txt must exist on disk');
        const content = readAppFile('Sangam-sathi', 'public', 'robots.txt');
        const res = parseRobotsTxt(content);
        assertOk(res.valid, `robots.txt parse errors: ${res.errors.join('; ')}`);
        assertOk(res.sitemap && res.sitemap.includes('sangamsathi'), 'Sitemap directive must reference domain');
      }
    },
    {
      name: 'TC-F14-02: sitemap.xml exists on disk with valid XML urlset and canonical URLs',
      fn: async () => {
        assertOk(appFileExists('Sangam-sathi', 'public', 'sitemap.xml'), 'apps/Sangam-sathi/public/sitemap.xml must exist on disk');
        const content = readAppFile('Sangam-sathi', 'public', 'sitemap.xml');
        const res = parseSitemapXml(content);
        assertOk(res.valid, `sitemap.xml parse errors: ${res.errors.join('; ')}`);
        assertOk(res.urlCount >= 2, 'sitemap.xml must index at least 2 routes');
      }
    },
    {
      name: 'TC-F14-03: llm.txt exists on disk with System Overview, Architecture, Tech Stack, and Endpoints',
      fn: async () => {
        assertOk(appFileExists('Sangam-sathi', 'public', 'llm.txt'), 'apps/Sangam-sathi/public/llm.txt must exist on disk');
        const content = readAppFile('Sangam-sathi', 'public', 'llm.txt');
        const res = parseLlmTxt(content);
        assertOk(res.valid, `llm.txt parse errors: ${res.errors.join('; ')}`);
      }
    },
    {
      name: 'TC-F14-04: Real 404 NotFound page component exists and is routed in App.tsx',
      fn: async () => {
        assertOk(appFileExists('Sangam-sathi', 'src', 'components', 'notFound', 'NotFoundPage.tsx'), 'NotFoundPage.tsx must exist');
        const appTsx = readAppFile('Sangam-sathi', 'src', 'App.tsx');
        assertOk(appTsx.includes('NotFoundPage'), 'App.tsx must import NotFoundPage');
        assertOk(/<Route\s+path=["']\*["']\s+element=\{<NotFoundPage\s*\/>\}/.test(appTsx), 'App.tsx must bind wildcard * route to NotFoundPage');
      }
    },
    {
      name: 'TC-F14-05: index.html favicon reference links to branded icon preventing default /vite.svg 404',
      fn: async () => {
        const html = readAppFile('Sangam-sathi', 'index.html');
        assertOk(!html.includes('/vite.svg'), 'Must not link to default unbranded /vite.svg');
        assertOk(html.includes('rel="icon"'), 'Must declare favicon link');
      }
    }
  ]
};
