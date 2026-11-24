/**
 * Tier 2 Boundary Test Suite: F7 - Girija-Kalyana Sponsor Lock Boundaries
 * Verifies tamper resistance when locked, case/space trimming, multi-param precedence, and re-entry.
 */

const { createSponsorLockStateMachine } = require('../helpers/sponsor-lock');
const { assertOk, assertEqual } = require('../helpers/assertions');

module.exports = {
  id: 'F07-BVA',
  name: 'Girija-Kalyana Sponsor Lock Boundaries',
  tier: 'tier2',
  tests: [
    {
      name: 'TC-F07-B01: Tamper resistance: Mutation attempt on locked field is rejected',
      fn: async () => {
        const sm = createSponsorLockStateMachine('?ref=LOCKED99');
        assertEqual(sm.getState().isLocked, true);

        const attempt = sm.updateInput('HACKED_CODE');
        assertEqual(attempt.success, false, 'Mutation must fail when locked');
        assertEqual(sm.getState().code, 'LOCKED99', 'Code must remain LOCKED99');
      }
    },
    {
      name: 'TC-F07-B02: Input trimming and uppercase normalization cleans raw input',
      fn: async () => {
        const sm = createSponsorLockStateMachine('');
        sm.updateInput('   gkpromo2026   ');
        assertEqual(sm.getState().code, 'GKPROMO2026', 'Whitespace and lowercase must be normalized');
      }
    },
    {
      name: 'TC-F07-B03: Query parameter precedence: ref takes precedence over promo and sponsor',
      fn: async () => {
        const sm = createSponsorLockStateMachine('?ref=REF_CODE&promo=PROMO_CODE');
        assertEqual(sm.getState().code, 'REF_CODE', 'ref param should have precedence');
      }
    },
    {
      name: 'TC-F07-B04: Auto-populated locked state rejects manual verification overwrite',
      fn: async () => {
        const sm = createSponsorLockStateMachine('?sponsor=INITIAL_CODE');
        const res = sm.applyVerificationResult({
          success: true,
          data: { isValid: true, promoterName: 'Other' }
        });
        assertEqual(res.success, false, 'Should reject manual verification when auto-populated');
      }
    },
    {
      name: 'TC-F07-B05: User can correct typos and retry after initial verification failure',
      fn: async () => {
        const sm = createSponsorLockStateMachine('');
        sm.updateInput('TYPO_CODE');
        sm.applyVerificationResult({ success: false, message: 'Invalid promocode' });
        assertEqual(sm.getState().isLocked, false, 'Must remain unlocked after failure');

        // Correction
        sm.updateInput('CORRECT_CODE');
        assertEqual(sm.getState().error, null, 'Error must reset on typing');
        sm.applyVerificationResult({
          success: true,
          data: { isValid: true, promoterName: 'Valid Promoter' }
        });
        assertEqual(sm.getState().isLocked, true, 'Must lock after valid correction');
      }
    }
  ]
};
