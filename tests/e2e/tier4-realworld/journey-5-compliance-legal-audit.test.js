/**
 * Tier 4 Real-World Scenario 5: Public Compliance & Legal Audit Walkthrough
 * Multi-step simulation of an independent regulatory or legal compliance audit
 * inspecting REAL workspace files on disk (PrivacyPolicy.tsx, TermsAndConditions.tsx, RefundPolicy.tsx).
 */

const { readAppFile, appFileExists } = require('../helpers/workspace-resolver');
const {
  verifyDpdp2023Compliance,
  verifyTermsAndConditions,
  createCookieConsentManager,
  scanForPlaceholders
} = require('../helpers/legal-compliance');
const { assertOk, assertEqual } = require('../helpers/assertions');

module.exports = {
  id: 'JOURNEY-05',
  name: 'Public Compliance & Legal Audit Walkthrough',
  tier: 'tier4',
  tests: [
    {
      name: 'Scenario 5: Complete regulatory legal compliance and anti-placeholder audit walkthrough',
      fn: async () => {
        // Step 1: Cookie consent audit
        const cookieMgr = createCookieConsentManager();
        assertEqual(cookieMgr.hasConsented(), false, 'Consent must not exist before user action');
        const consent = cookieMgr.acceptAll();
        assertEqual(consent.essential, true);
        assertEqual(consent.analytics, true);
        assertEqual(cookieMgr.hasConsented(), true, 'Consent must be safely recorded');

        // Step 2: Privacy Policy DPDP 2023 audit from real component file
        assertOk(appFileExists('Girija-Kalyana', 'src', 'components', 'legal', 'PrivacyPolicy.tsx'), 'PrivacyPolicy.tsx must exist');
        const privacyText = readAppFile('Girija-Kalyana', 'src', 'components', 'legal', 'PrivacyPolicy.tsx');
        const dpdpAudit = verifyDpdp2023Compliance(privacyText);
        assertOk(dpdpAudit.compliant, `DPDP 2023 audit failed: ${dpdpAudit.errors.join('; ')}`);

        // Step 3: Terms & Conditions legal covenants audit from real component file
        assertOk(appFileExists('Girija-Kalyana', 'src', 'components', 'legal', 'TermsAndConditions.tsx'), 'TermsAndConditions.tsx must exist');
        const termsText = readAppFile('Girija-Kalyana', 'src', 'components', 'legal', 'TermsAndConditions.tsx');
        const termsAudit = verifyTermsAndConditions(termsText);
        assertOk(termsAudit.compliant, `Terms audit failed: ${termsAudit.errors.join('; ')}`);

        // Step 4: Refund Policy conditions audit from real component file
        assertOk(appFileExists('Girija-Kalyana', 'src', 'components', 'legal', 'RefundPolicy.tsx'), 'RefundPolicy.tsx must exist');
        const refundText = readAppFile('Girija-Kalyana', 'src', 'components', 'legal', 'RefundPolicy.tsx');
        assertOk(refundText.toLowerCase().includes('cooling-off') || refundText.toLowerCase().includes('refund'), 'Refund policy must specify refund terms');

        // Step 5: Anti-placeholder sweep across all legal documents
        const docs = [privacyText, termsText, refundText];
        for (const doc of docs) {
          const placeholderAudit = scanForPlaceholders(doc);
          assertOk(placeholderAudit.clean, `Document failed anti-placeholder check: ${placeholderAudit.detected.join('; ')}`);
        }
      }
    }
  ]
};
