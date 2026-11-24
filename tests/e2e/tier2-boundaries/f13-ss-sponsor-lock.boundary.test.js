/**
 * Tier 2 Boundary Test Suite: F13 - Sangam-sathi Sponsor Lock Boundaries
 * Verifies locked immutability, mixed-case normalization, blank submission rejection, and retry limits.
 */

const { createSponsorLockStateMachine } = require('../helpers/sponsor-lock');
const { assertOk, assertEqual } = require('../helpers/assertions');

module.exports = {
  id: 'F13-BVA',
  name: 'Sangam-sathi Sponsor Lock Boundaries',
  tier: 'tier2',
  tests: [
    {
      name: 'TC-F13-B01: Tampering attempt rejected when field was locked via ?ref=SANGAM99',
      fn: async () => {
        const sm = createSponsorLockStateMachine('?ref=SANGAM99');
        const res = sm.updateInput('NEW_CODE');
        assertEqual(res.success, false, 'Mutation must be rejected');
        assertEqual(sm.getState().code, 'SANGAM99', 'Code must remain original');
      }
    },
    {
      name: 'TC-F13-B02: Mixed-case code normalization to uppercase',
      fn: async () => {
        const sm = createSponsorLockStateMachine('');
        sm.updateInput('sAnGaM2026');
        assertEqual(sm.getState().code, 'SANGAM2026', 'Code must be uppercase');
      }
    },
    {
      name: 'TC-F13-B03: Whitespace trimming on manual code entry',
      fn: async () => {
        const sm = createSponsorLockStateMachine('');
        sm.updateInput('   SSCODE   ');
        assertEqual(sm.getState().code, 'SSCODE', 'Leading/trailing spaces trimmed');
      }
    },
    {
      name: 'TC-F13-B04: Consecutive verification failures maintain unlocked state with latest error message',
      fn: async () => {
        const sm = createSponsorLockStateMachine('');
        sm.updateInput('FAIL1');
        sm.applyVerificationResult({ success: false, message: 'Code not found' });
        assertEqual(sm.getState().isLocked, false);

        sm.updateInput('FAIL2');
        sm.applyVerificationResult({ success: false, message: 'Code expired' });
        assertEqual(sm.getState().isLocked, false);
        assertEqual(sm.getState().error, 'Code expired');
      }
    },
    {
      name: 'TC-F13-B05: Auto-populated empty query param (?ref=) does not lock field',
      fn: async () => {
        const sm = createSponsorLockStateMachine('?ref=');
        assertEqual(sm.getState().isLocked, false, 'Empty ref param should not lock field');
        assertEqual(sm.getState().isAutoPopulated, false, 'isAutoPopulated should be false');
      }
    }
  ]
};
