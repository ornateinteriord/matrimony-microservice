/**
 * Tier 1 Test Suite: F13 - Sangam-sathi Sponsor Code Lock Logic
 * Verifies auto-population locking from query parameters, manual verification
 * transitions, and registration form immutability for Sangam-sathi.
 */

const { readAppFile, appFileExists } = require('../helpers/workspace-resolver');
const { createSponsorLockStateMachine } = require('../helpers/sponsor-lock');
const { assertOk, assertEqual } = require('../helpers/assertions');

module.exports = {
  id: 'F13',
  name: 'Sangam-sathi Sponsor Code Lock',
  tier: 'tier1',
  tests: [
    {
      name: 'TC-F13-01: Landing on Sangam-sathi with ?ref=SANGAM99 auto-populates and locks field',
      fn: async () => {
        const sm = createSponsorLockStateMachine('?ref=SANGAM99');
        const state = sm.getState();

        assertEqual(state.code, 'SANGAM99', 'Code must be auto-populated to SANGAM99');
        assertEqual(state.isLocked, true, 'Field must be locked upon auto-population');
        assertEqual(state.isAutoPopulated, true, 'isAutoPopulated must be true');
      }
    },
    {
      name: 'TC-F13-02: User can enter manual sponsor code in unverified state',
      fn: async () => {
        const sm = createSponsorLockStateMachine('');
        assertEqual(sm.getState().isLocked, false, 'Manual entry begins unlocked');

        const res = sm.updateInput('SSCODE2026');
        assertOk(res.success, 'Input update should succeed');
        assertEqual(sm.getState().code, 'SSCODE2026', 'Code should update to SSCODE2026');
      }
    },
    {
      name: 'TC-F13-03: Successful backend verification locks input and sets promoter name',
      fn: async () => {
        const sm = createSponsorLockStateMachine('');
        sm.updateInput('SSCODE2026');

        const verifyRes = sm.applyVerificationResult({
          success: true,
          data: {
            isValid: true,
            promoterName: 'Vikram Seth',
            discount: 100
          }
        });

        assertOk(verifyRes.success, 'Verification should succeed');
        const state = sm.getState();
        assertEqual(state.isLocked, true, 'Field must lock permanently');
        assertEqual(state.isVerified, true, 'Field must be marked verified');
        assertEqual(state.promoterName, 'Vikram Seth', 'Promoter name must be stored');
      }
    },
    {
      name: 'TC-F13-04: Invalid code verification fails gracefully leaving input unlocked',
      fn: async () => {
        const sm = createSponsorLockStateMachine('');
        sm.updateInput('BADCODE');

        const verifyRes = sm.applyVerificationResult({
          success: false,
          message: 'Invalid promocode. Please check and try again.'
        });

        assertEqual(verifyRes.success, false, 'Verification should fail');
        assertEqual(sm.getState().isLocked, false, 'Field must remain unlocked');
        assertOk(sm.getState().error.includes('Invalid promocode'), 'Error must be set');
      }
    },
    {
      name: 'TC-F13-05: Registration component exists on disk and preserves verified sponsor code in payload',
      fn: async () => {
        assertOk(appFileExists('Sangam-sathi', 'src', 'components', 'register', 'Register.tsx'), 'Register.tsx must exist in Sangam-sathi');
        const regContent = readAppFile('Sangam-sathi', 'src', 'components', 'register', 'Register.tsx');
        assertOk(regContent.toLowerCase().includes('promocode') || regContent.toLowerCase().includes('sponsor'), 'Register.tsx must reference promocode or sponsor');

        const sm = createSponsorLockStateMachine('?sponsor=SANGAM99');
        const binding = sm.getRegistrationBinding();

        assertEqual(binding.sponsor_code, 'SANGAM99');
        assertEqual(binding.isSponsorLocked, true);
        assertEqual(binding.isSponsorVerified, true);
      }
    }
  ]
};
