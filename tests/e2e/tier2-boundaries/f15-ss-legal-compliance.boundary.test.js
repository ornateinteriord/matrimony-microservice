/**
 * Tier 2 Boundary Test Suite: F15 - Sangam-sathi Legal Compliance Boundaries
 * Verifies omission of Data Principal rights, missing grievance redressal, and placeholder detection.
 */

const {
  verifyDpdp2023Compliance,
  verifyTermsAndConditions,
  scanForPlaceholders,
  createCookieConsentManager
} = require('../helpers/legal-compliance');
const { assertOk, assertEqual } = require('../helpers/assertions');

module.exports = {
  id: 'F15-BVA',
  name: 'Sangam-sathi Legal Compliance Boundaries',
  tier: 'tier2',
  tests: [
    {
      name: 'TC-F15-B01: Policy missing explicit Data Principal rights is flagged',
      fn: async () => {
        const policyNoRights = 'Digital Personal Data Protection Act 2023. Grievance Redressal: dpo@test.com';
        const res = verifyDpdp2023Compliance(policyNoRights);
        assertEqual(res.compliant, false, 'Missing Data Principal rights must fail');
        assertOk(res.errors.some(e => e.includes('Data Principal Rights')));
      }
    },
    {
      name: 'TC-F15-B02: Policy missing Grievance Redressal / DPO is flagged',
      fn: async () => {
        const policyNoGrievance = 'DPDP Act 2023. Rights of the Data Principal: Right to access, erase. Email: contact@test.com';
        const res = verifyDpdp2023Compliance(policyNoGrievance);
        assertEqual(res.compliant, false, 'Missing grievance officer must fail');
      }
    },
    {
      name: 'TC-F15-B03: Anti-placeholder scanner catches "TODO" and "example.com" in legal copy',
      fn: async () => {
        const draftLegalText = 'Contact our legal team at compliance@example.com. TODO: Add address.';
        const res = scanForPlaceholders(draftLegalText);
        assertEqual(res.clean, false, 'TODO and example.com must be caught');
        assertEqual(res.detected.length, 2);
      }
    },
    {
      name: 'TC-F15-B04: Terms missing account termination clause is flagged',
      fn: async () => {
        const incompleteTerms = 'Eligibility: 18 years. Code of Conduct: Standard. Jurisdiction: Bengaluru.';
        const res = verifyTermsAndConditions(incompleteTerms);
        assertEqual(res.compliant, false, 'Missing termination clause must fail');
        assertOk(res.errors.some(e => e.includes('Account Termination')));
      }
    },
    {
      name: 'TC-F15-B05: Cookie manager gracefully handles non-boolean consent fields',
      fn: async () => {
        const malformedStore = { matrimony_cookie_consent: JSON.stringify({ essential: 'yes' }) };
        const cookieMgr = createCookieConsentManager(malformedStore);
        const consent = cookieMgr.getConsent();
        assertOk(consent, 'Should parse stored object');
        assertEqual(typeof consent.essential, 'string', 'Preserves original payload');
      }
    }
  ]
};
