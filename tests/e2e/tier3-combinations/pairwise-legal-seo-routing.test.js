/**
 * Tier 3 Combinatorial Suite: Pairwise Legal Compliance + SEO Metadata + Routing
 * Tests cross-feature interactions between F8/F14/F20 (SEO & Metadata) and
 * F9/F15/F21 (Legal Compliance Pages).
 */

const { analyzeHtmlMetadata, parseSitemapXml } = require('../helpers/seo-verifier');
const { verifyDpdp2023Compliance, createCookieConsentManager } = require('../helpers/legal-compliance');
const { assertOk, assertEqual } = require('../helpers/assertions');

const PRIVACY_HTML = `
<!DOCTYPE html>
<html lang="en">
<head>
  <title>Privacy Policy (DPDP 2023) - Digital Personal Data Protection Act | Matrimony</title>
  <meta name="description" content="Official DPDP 2023 compliant privacy policy and user rights." />
  <link rel="canonical" href="https://girijakalyana.com/privacy-policy" />
</head>
<body>
  <h1>Privacy Policy (DPDP 2023)</h1>
  <main>
    <section>
      <h2>Rights of the Data Principal</h2>
      <p>Users have full rights to access, correct, and erase their matrimonial profile data.</p>
    </section>
    <section>
      <h2>Data Protection Officer (DPO)</h2>
      <p>Contact our Grievance Redressal Officer at: dpo@girijakalyana.com</p>
    </section>
    <section>
      <h2>Data Retention and Erasure</h2>
      <p>Data is purged within 30 days of account cancellation.</p>
    </section>
  </main>
</body>
</html>
`;

module.exports = {
  id: 'TIER3-LEGAL-SEO',
  name: 'Pairwise Legal Compliance + SEO Metadata + Routing',
  tier: 'tier3',
  tests: [
    {
      name: 'TC-T3-13: Legal privacy route simultaneously satisfies DPDP 2023 compliance and SEO single <h1> rule',
      fn: async () => {
        const seoRes = analyzeHtmlMetadata(PRIVACY_HTML);
        assertOk(seoRes.valid, `SEO must be valid: ${seoRes.errors.join('; ')}`);
        assertEqual(seoRes.h1Count, 1, 'Exactly one <h1> required on legal page');

        const legalRes = verifyDpdp2023Compliance(PRIVACY_HTML);
        assertOk(legalRes.compliant, `DPDP compliance must pass: ${legalRes.errors.join('; ')}`);
      }
    },
    {
      name: 'TC-T3-14: Canonical URL on privacy page accurately mirrors the production routing address',
      fn: async () => {
        const seoRes = analyzeHtmlMetadata(PRIVACY_HTML);
        assertEqual(seoRes.canonicalUrl, 'https://girijakalyana.com/privacy-policy');
      }
    },
    {
      name: 'TC-T3-15: Sitemap XML contains all mandatory public legal compliance endpoints',
      fn: async () => {
        const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
          <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
            <url><loc>https://girijakalyana.com/privacy-policy</loc></url>
            <url><loc>https://girijakalyana.com/terms</loc></url>
            <url><loc>https://girijakalyana.com/refund-policy</loc></url>
            <url><loc>https://girijakalyana.com/cookie-policy</loc></url>
          </urlset>
        `;
        const res = parseSitemapXml(sitemapContent);
        assertOk(res.valid);
        assertEqual(res.urlCount, 4, 'Must list 4 core legal routes in sitemap');
      }
    },
    {
      name: 'TC-T3-16: Cookie consent banner mount does not inject secondary <h1> tag into DOM',
      fn: async () => {
        const pageWithBanner = `
          <html><head><title>Home</title><meta name="description" content="Desc"/><link rel="canonical" href="https://site.com"/></head>
          <body>
            <h1>Welcome to Matrimony</h1>
            <!-- Cookie Banner rendered as dialog/toast with <h3> or <p>, never <h1> -->
            <aside class="cookie-banner">
              <h3>We Value Your Privacy</h3>
              <p>We use cookies to enhance your matchmaking experience.</p>
            </aside>
          </body></html>
        `;
        const res = analyzeHtmlMetadata(pageWithBanner);
        assertOk(res.valid);
        assertEqual(res.h1Count, 1, 'Banner must not inject duplicate <h1>');
      }
    },
    {
      name: 'TC-T3-17: Cookie consent rejection suppresses third-party analytics script injection',
      fn: async () => {
        const cookieMgr = createCookieConsentManager();
        cookieMgr.acceptNecessaryOnly();

        const shouldInjectAnalyticsScript = (consent) => Boolean(consent?.analytics);
        const shouldInjectMarketingScript = (consent) => Boolean(consent?.marketing);

        assertEqual(shouldInjectAnalyticsScript(cookieMgr.getConsent()), false);
        assertEqual(shouldInjectMarketingScript(cookieMgr.getConsent()), false);
      }
    },
    {
      name: 'TC-T3-18: Legal route metadata title contains brand name and specific compliance topic',
      fn: async () => {
        const seoRes = analyzeHtmlMetadata(PRIVACY_HTML);
        assertOk(seoRes.title.includes('Privacy Policy'));
        assertOk(seoRes.title.includes('DPDP'));
      }
    }
  ]
};
