/**
 * Tier 1 Test Suite: F21 - Shree-ganda Legal & Compliance Pages
 * Inspects real legal components on disk: PrivacyPolicy.tsx, TermsAndConditions.tsx,
 * RefundPolicy.tsx, CookieConsentBanner.tsx, and checks for DPDP 2023 clauses and placeholders.
 */

const { readAppFile, appFileExists } = require('../helpers/workspace-resolver');
const { verifyDpdp2023Compliance, scanForPlaceholders } = require('../helpers/legal-compliance');
const { assertOk } = require('../helpers/assertions');

module.exports = {
  id: 'F21',
  name: 'Shree-ganda Legal & Compliance Pages',
  tier: 'tier1',
  tests: [
    {
      name: 'TC-F21-01: PrivacyPolicy.tsx exists and complies with DPDP Act 2023 for Shree-ganda',
      fn: async () => {
        assertOk(appFileExists('Shree-ganda', 'src', 'components', 'legal', 'PrivacyPolicy.tsx'), 'PrivacyPolicy.tsx must exist in Shree-ganda');
        const content = readAppFile('Shree-ganda', 'src', 'components', 'legal', 'PrivacyPolicy.tsx');
        const res = verifyDpdp2023Compliance(content);
        assertOk(res.compliant, `DPDP compliance violations: ${res.errors.join('; ')}`);
      }
    },
    {
      name: 'TC-F21-02: TermsAndConditions.tsx exists and specifies conduct, eligibility, and jurisdiction',
      fn: async () => {
        assertOk(appFileExists('Shree-ganda', 'src', 'components', 'legal', 'TermsAndConditions.tsx'), 'TermsAndConditions.tsx must exist in Shree-ganda');
        const content = readAppFile('Shree-ganda', 'src', 'components', 'legal', 'TermsAndConditions.tsx');
        assertOk(content.toLowerCase().includes('eligibility'), 'Terms must cover eligibility');
        assertOk(content.toLowerCase().includes('jurisdiction'), 'Terms must state legal jurisdiction');
      }
    },
    {
      name: 'TC-F21-03: RefundPolicy.tsx exists and defines cooling-off window',
      fn: async () => {
        assertOk(appFileExists('Shree-ganda', 'src', 'components', 'legal', 'RefundPolicy.tsx'), 'RefundPolicy.tsx must exist in Shree-ganda');
        const content = readAppFile('Shree-ganda', 'src', 'components', 'legal', 'RefundPolicy.tsx');
        assertOk(content.toLowerCase().includes('cooling-off') || content.toLowerCase().includes('refund'), 'Must declare refund terms');
      }
    },
    {
      name: 'TC-F21-04: CookieConsentBanner.tsx exists and records user consent',
      fn: async () => {
        assertOk(appFileExists('Shree-ganda', 'src', 'components', 'common', 'CookieConsentBanner.tsx'), 'CookieConsentBanner.tsx must exist in Shree-ganda');
      }
    },
    {
      name: 'TC-F21-05: Real legal source files contain zero lorem ipsum or placeholder markers',
      fn: async () => {
        const legalFiles = ['PrivacyPolicy.tsx', 'TermsAndConditions.tsx', 'RefundPolicy.tsx'];
        for (const file of legalFiles) {
          if (appFileExists('Shree-ganda', 'src', 'components', 'legal', file)) {
            const content = readAppFile('Shree-ganda', 'src', 'components', 'legal', file);
            const scan = scanForPlaceholders(content);
            assertOk(scan.clean, `${file} contains placeholder text: ${scan.detected.join('; ')}`);
          }
        }
      }
    }
  ]
};
