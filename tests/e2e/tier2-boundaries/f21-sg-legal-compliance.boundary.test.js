/**
 * Tier 2 Boundary Test Suite: F21 - Shree-ganda Legal Compliance Boundaries
 * Verifies retention clauses, placeholder detection, code of conduct requirements, and consent mutation.
 */

const {
  verifyDpdp2023Compliance,
  verifyTermsAndConditions,
  scanForPlaceholders,
  createCookieConsentManager
} = require('../helpers/legal-compliance');
const { assertOk, assertEqual } = require('../helpers/assertions');

module.exports = {
  id: 'F21-BVA',
  name: 'Shree-ganda Legal Compliance Boundaries',
  tier: 'tier2',
  tests: [
    {
      name: 'TC-F21-B01: Policy missing Data Retention / Erasure clause is flagged non-compliant',
      fn: async () => {
        const policyNoRetention = `
          Digital Personal Data Protection Act 2023.
          Rights of the Data Principal: Access and correct.
          Grievance Officer Email: dpo@test.com
        `;
        const res = verifyDpdp2023Compliance(policyNoRetention);
        assertEqual(res.compliant, false, 'Must flag missing Data Retention / Erasure clause');
        assertOk(res.errors.some(e => e.includes('Data Retention')));
      }
    },
    {
      name: 'TC-F21-B02: Anti-placeholder scanner catches "xyz road" and "[insert phone]"',
      fn: async () => {
        const draftCopy = 'Our office is located at 123 xyz road, Bengaluru. Phone: [insert phone number]';
        const res = scanForPlaceholders(draftCopy);
        assertEqual(res.clean, false, 'Placeholder patterns must be caught');
        assertEqual(res.detected.length, 2);
      }
    },
    {
      name: 'TC-F21-B03: Terms missing Code of Conduct / misuse prohibition is flagged',
      fn: async () => {
        const termsNoConduct = 'Eligibility: 18 years. Account Termination: Yes. Jurisdiction: Bengaluru.';
        const res = verifyTermsAndConditions(termsNoConduct);
        assertEqual(res.compliant, false, 'Missing Code of Conduct must fail');
        assertOk(res.errors.some(e => e.includes('Code of Conduct')));
      }
    },
    {
      name: 'TC-F21-B04: Consent state mutation: User can upgrade from Necessary Only to Accept All',
      fn: async () => {
        const cookieMgr = createCookieConsentManager();
        cookieMgr.acceptNecessaryOnly();
        assertEqual(cookieMgr.getConsent().analytics, false, 'Analytics false initially');

        // Upgrade consent
        cookieMgr.acceptAll();
        assertEqual(cookieMgr.getConsent().analytics, true, 'Analytics upgraded to true');
      }
    },
    {
      name: 'TC-F21-B05: Non-string inputs to compliance validators fail safely with error report',
      fn: async () => {
        assertEqual(verifyDpdp2023Compliance(null).compliant, false);
        assertEqual(verifyTermsAndConditions(12345).compliant, false);
        assertEqual(scanForPlaceholders({}).clean, false);
      }
    }
  ]
};
