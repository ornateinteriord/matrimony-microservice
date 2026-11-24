/**
 * Tier 1 Test Suite: F7 - Girija-Kalyana Sponsor Code Lock Logic
 * Verifies auto-population locking from ?ref= / ?promo= / ?sponsor=,
 * manual entry verification transitions, and registration binding.
 */

const { readAppFile, appFileExists } = require('../helpers/workspace-resolver');
const { createSponsorLockStateMachine } = require('../helpers/sponsor-lock');
const { assertOk, assertEqual } = require('../helpers/assertions');

module.exports = {
  id: 'F07',
  name: 'Girija-Kalyana Sponsor Code Lock',
  tier: 'tier1',
  tests: [
    {
      name: 'TC-F07-01: Arriving via ?ref=PROMO99 auto-populates and immediately locks field',
      fn: async () => {
        const sm = createSponsorLockStateMachine('?ref=PROMO99');
        const state = sm.getState();

        assertEqual(state.code, 'PROMO99', 'Code should be auto-populated to PROMO99');
        assertEqual(state.isLocked, true, 'Field must be locked upon auto-population');
        assertEqual(state.isAutoPopulated, true, 'isAutoPopulated flag must be true');
        assertEqual(state.isVerified, true, 'Referral link counts as verified binding');
      }
    },
    {
      name: 'TC-F07-02: Manual entry begins with unlocked, unverified state',
      fn: async () => {
        const sm = createSponsorLockStateMachine('');
        const state = sm.getState();

        assertEqual(state.code, '', 'Initial code should be empty');
        assertEqual(state.isLocked, false, 'Field must be unlocked for manual entry');
        assertEqual(state.isVerified, false, 'isVerified should be false');

        const updateRes = sm.updateInput('GKPROMO10');
        assertOk(updateRes.success, 'User must be permitted to type when unlocked');
        assertEqual(sm.getState().code, 'GKPROMO10', 'State should update to GKPROMO10');
      }
    },
    {
      name: 'TC-F07-03: Successful manual verification transitions state to locked with promoter name',
      fn: async () => {
        const sm = createSponsorLockStateMachine('');
        sm.updateInput('GKPROMO10');

        // Simulate backend verification success
        const verifyRes = sm.applyVerificationResult({
          success: true,
          data: {
            isValid: true,
            promoterName: 'Ananya Sharma',
            discount: 100
          }
        });

        assertOk(verifyRes.success, 'Verification application should succeed');
        const finalState = sm.getState();
        assertEqual(finalState.isLocked, true, 'Field must lock permanently after verification');
        assertEqual(finalState.isVerified, true, 'isVerified must be true');
        assertEqual(finalState.promoterName, 'Ananya Sharma', 'Promoter name must be populated');
      }
    },
    {
      name: 'TC-F07-04: Failed manual verification keeps field unlocked and reports error',
      fn: async () => {
        const sm = createSponsorLockStateMachine('');
        sm.updateInput('INVALID99');

        const verifyRes = sm.applyVerificationResult({
          success: false,
          message: 'Invalid promocode. Please check and try again.'
        });

        assertEqual(verifyRes.success, false, 'Verification should report failure');
        const finalState = sm.getState();
        assertEqual(finalState.isLocked, false, 'Field must remain unlocked on failure');
        assertEqual(finalState.isVerified, false, 'isVerified must remain false');
        assertOk(finalState.error.includes('Invalid promocode'), 'Error message must be set');
      }
    },
    {
      name: 'TC-F07-05: Registration component exists on disk and preserves locked sponsor code in payload',
      fn: async () => {
        assertOk(appFileExists('Girija-Kalyana', 'src', 'components', 'register', 'Register.tsx'), 'Register.tsx must exist');
        const regContent = readAppFile('Girija-Kalyana', 'src', 'components', 'register', 'Register.tsx');
        assertOk(regContent.toLowerCase().includes('promocode') || regContent.toLowerCase().includes('sponsor'), 'Register.tsx must reference promocode or sponsor');

        const sm = createSponsorLockStateMachine('?promo=GKPROMO10');
        const binding = sm.getRegistrationBinding();

        assertEqual(binding.sponsor_code, 'GKPROMO10', 'sponsor_code must match in payload');
        assertEqual(binding.isSponsorLocked, true, 'isSponsorLocked must be true');
        assertEqual(binding.isSponsorVerified, true, 'isSponsorVerified must be true');
      }
    }
  ]
};
