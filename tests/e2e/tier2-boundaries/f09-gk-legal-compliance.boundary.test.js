/**
 * Tier 2 Boundary Test Suite: F9 - Girija-Kalyana Legal Compliance Boundaries
 * Verifies DPDP clause omissions, placeholder text detection, and cookie parse resiliency.
 */

const {
  verifyDpdp2023Compliance,
  verifyTermsAndConditions,
  scanForPlaceholders,
  createCookieConsentManager
} = require('../helpers/legal-compliance');
const { assertOk, assertEqual } = require('../helpers/assertions');

module.exports = {
  id: 'F09-BVA',
  name: 'Girija-Kalyana Legal Compliance Boundaries',
  tier: 'tier2',
  tests: [
    {
      name: 'TC-F09-B01: Privacy policy missing DPDP 2023 reference is flagged non-compliant',
      fn: async () => {
        const legacyPolicy = 'We protect your data. You have rights to your data. Email: dpo@test.com';
        const res = verifyDpdp2023Compliance(legacyPolicy);
        assertEqual(res.compliant, false, 'Must flag missing DPDP reference');
        assertOk(res.errors.some(e => e.includes('DPDP Act Reference')));
      }
    },
    {
      name: 'TC-F09-B02: Privacy policy missing DPO contact email is flagged non-compliant',
      fn: async () => {
        const noDpoPolicy = 'Digital Personal Data Protection Act 2023. Rights of the Data Principal include access and erasure.';
        const res = verifyDpdp2023Compliance(noDpoPolicy);
        assertEqual(res.compliant, false, 'Must flag missing DPO contact');
      }
    },
    {
      name: 'TC-F09-B03: Anti-placeholder scanner flags "Lorem ipsum" and "[Insert Company Name]"',
      fn: async () => {
        const dirtyText = 'This policy belongs to [Insert Company Name]. Lorem ipsum dolor sit amet.';
        const res = scanForPlaceholders(dirtyText);
        assertEqual(res.clean, false, 'Placeholders must be flagged');
        assertEqual(res.detected.length, 2, 'Must detect both placeholder tokens');
      }
    },
    {
      name: 'TC-F09-B04: Terms & Conditions missing dispute jurisdiction clause is flagged',
      fn: async () => {
        const incompleteTerms = 'Eligibility: 18 years. Termination: We can terminate accounts. Code of Conduct: Be good.';
        const res = verifyTermsAndConditions(incompleteTerms);
        assertEqual(res.compliant, false, 'Must flag missing dispute jurisdiction');
        assertOk(res.errors.some(e => e.includes('Dispute Jurisdiction')));
      }
    },
    {
      name: 'TC-F09-B05: Cookie consent manager handles corrupted localStorage safely',
      fn: async () => {
        const corruptedStore = { matrimony_cookie_consent: 'CORRUPTED_NOT_JSON{' };
        const cookieMgr = createCookieConsentManager(corruptedStore);

        let threw = false;
        try {
          cookieMgr.getConsent();
        } catch (e) {
          threw = true;
        }
        assertEqual(threw, true, 'Corrupted JSON in store throws parse error cleanly');
      }
    }
  ]
};
