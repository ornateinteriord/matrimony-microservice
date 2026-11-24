/**
 * Tier 2 Boundary Test Suite: F19 - Shree-ganda Sponsor Lock Boundaries
 * Verifies post-verification lock immutability, lowercase normalization, and error state resets.
 */

const { createSponsorLockStateMachine } = require('../helpers/sponsor-lock');
const { assertOk, assertEqual } = require('../helpers/assertions');

module.exports = {
  id: 'F19-BVA',
  name: 'Shree-ganda Sponsor Lock Boundaries',
  tier: 'tier2',
  tests: [
    {
      name: 'TC-F19-B01: Mutation attempt rejected when field was locked via ?promo=SHREEGOLD',
      fn: async () => {
        const sm = createSponsorLockStateMachine('?promo=SHREEGOLD');
        const res = sm.updateInput('HACKED');
        assertEqual(res.success, false, 'Mutation must fail when locked');
        assertEqual(sm.getState().code, 'SHREEGOLD', 'Code must remain original');
      }
    },
    {
      name: 'TC-F19-B02: Manual entry field locks permanently upon successful verification',
      fn: async () => {
        const sm = createSponsorLockStateMachine('');
        sm.updateInput('SGCODE2026');
        sm.applyVerificationResult({
          success: true,
          data: { isValid: true, promoterName: 'Promoter A' }
        });

        assertEqual(sm.getState().isLocked, true);
        const secondAttempt = sm.updateInput('CHANGED_CODE');
        assertEqual(secondAttempt.success, false, 'Field must remain permanently locked');
      }
    },
    {
      name: 'TC-F19-B03: Lowercase input string automatically converted to uppercase',
      fn: async () => {
        const sm = createSponsorLockStateMachine('');
        sm.updateInput('shreeganda10');
        assertEqual(sm.getState().code, 'SHREEGANDA10');
      }
    },
    {
      name: 'TC-F19-B04: Error message resets to null upon user typing new input',
      fn: async () => {
        const sm = createSponsorLockStateMachine('');
        sm.updateInput('INVALID');
        sm.applyVerificationResult({ success: false, message: 'Invalid promocode' });
        assertEqual(sm.getState().error, 'Invalid promocode');

        sm.updateInput('NEWTRY');
        assertEqual(sm.getState().error, null, 'Error must reset to null');
      }
    },
    {
      name: 'TC-F19-B05: Special characters in input are retained without breaking state machine',
      fn: async () => {
        const sm = createSponsorLockStateMachine('');
        const res = sm.updateInput('CODE-123_#');
        assertOk(res.success);
        assertEqual(sm.getState().code, 'CODE-123_#');
      }
    }
  ]
};
