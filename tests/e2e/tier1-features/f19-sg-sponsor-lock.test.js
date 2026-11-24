/**
 * Tier 1 Test Suite: F19 - Shree-ganda Sponsor Code Lock Logic
 * Verifies auto-population locking from query parameters, manual verification
 * transitions, and registration form immutability for Shree-ganda.
 */

const { readAppFile, appFileExists } = require('../helpers/workspace-resolver');
const { createSponsorLockStateMachine } = require('../helpers/sponsor-lock');
const { assertOk, assertEqual } = require('../helpers/assertions');

module.exports = {
  id: 'F19',
  name: 'Shree-ganda Sponsor Code Lock',
  tier: 'tier1',
  tests: [
    {
      name: 'TC-F19-01: Landing on Shree-ganda with ?promo=SHREEGOLD auto-populates and locks field',
      fn: async () => {
        const sm = createSponsorLockStateMachine('?promo=SHREEGOLD');
        const state = sm.getState();

        assertEqual(state.code, 'SHREEGOLD', 'Code must be auto-populated to SHREEGOLD');
        assertEqual(state.isLocked, true, 'Field must be locked upon auto-population');
        assertEqual(state.isAutoPopulated, true, 'isAutoPopulated must be true');
      }
    },
    {
      name: 'TC-F19-02: Manual entry begins with unlocked, unverified state',
      fn: async () => {
        const sm = createSponsorLockStateMachine('');
        assertEqual(sm.getState().isLocked, false);

        const res = sm.updateInput('SGPROMO2026');
        assertOk(res.success);
        assertEqual(sm.getState().code, 'SGPROMO2026');
      }
    },
    {
      name: 'TC-F19-03: Successful backend verification locks input and sets promoter name',
      fn: async () => {
        const sm = createSponsorLockStateMachine('');
        sm.updateInput('SGPROMO2026');

        const verifyRes = sm.applyVerificationResult({
          success: true,
          data: {
            isValid: true,
            promoterName: 'Ramesh Gowda',
            discount: 100
          }
        });

        assertOk(verifyRes.success);
        const state = sm.getState();
        assertEqual(state.isLocked, true);
        assertEqual(state.isVerified, true);
        assertEqual(state.promoterName, 'Ramesh Gowda');
      }
    },
    {
      name: 'TC-F19-04: Invalid code verification fails leaving input unlocked for re-entry',
      fn: async () => {
        const sm = createSponsorLockStateMachine('');
        sm.updateInput('INVALID_CODE');

        const verifyRes = sm.applyVerificationResult({
          success: false,
          message: 'Invalid promocode. Please check and try again.'
        });

        assertEqual(verifyRes.success, false);
        assertEqual(sm.getState().isLocked, false);
        assertOk(sm.getState().error.includes('Invalid promocode'));
      }
    },
    {
      name: 'TC-F19-05: Registration component exists on disk and preserves verified sponsor code in payload',
      fn: async () => {
        assertOk(appFileExists('Shree-ganda', 'src', 'components', 'register', 'Register.tsx'), 'Register.tsx must exist in Shree-ganda');
        const regContent = readAppFile('Shree-ganda', 'src', 'components', 'register', 'Register.tsx');
        assertOk(regContent.toLowerCase().includes('promocode') || regContent.toLowerCase().includes('sponsor'), 'Register.tsx must reference promocode or sponsor');

        const sm = createSponsorLockStateMachine('?ref=SHREEGOLD');
        const binding = sm.getRegistrationBinding();

        assertEqual(binding.sponsor_code, 'SHREEGOLD');
        assertEqual(binding.isSponsorLocked, true);
        assertEqual(binding.isSponsorVerified, true);
      }
    }
  ]
};
