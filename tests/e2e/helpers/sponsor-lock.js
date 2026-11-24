/**
 * Sponsor / Referral Code Lock state machine helper.
 * Models and verifies the exact locking behavior specified in R3 / PROJECT.md:
 * - If arrived via URL (?ref=, ?promo=, ?sponsor=), code is auto-populated and permanently locked.
 * - If entered manually, field is editable until successfully verified against backend; once verified, locked permanently.
 */

function createSponsorLockStateMachine(initialSearchParams = '') {
  const params = new URLSearchParams(initialSearchParams);
  const rawCode = params.get('ref') || params.get('promo') || params.get('sponsor') || '';
  const code = rawCode.trim().toUpperCase();
  const isAutoPopulated = Boolean(code);

  let state = {
    code: code,
    promoterName: '',
    isLocked: isAutoPopulated, // If auto-populated from URL, immediately locked
    isVerified: isAutoPopulated, // Auto-populated referral link counts as pre-bound
    isAutoPopulated: isAutoPopulated,
    error: null
  };

  return {
    getState: () => ({ ...state }),

    /**
     * User attempts to type or change code.
     * Must be rejected if field is locked.
     */
    updateInput: (newVal) => {
      if (state.isLocked) {
        return { success: false, reason: 'Field is locked and immutable' };
      }
      const trimmed = String(newVal || '').trim().toUpperCase();
      state.code = trimmed;
      state.error = null;
      state.isVerified = false;
      return { success: true, code: state.code };
    },

    /**
     * Simulates backend verification response.
     * When verification succeeds, locks the field permanently.
     */
    applyVerificationResult: (result) => {
      if (state.isLocked && state.isAutoPopulated) {
        return { success: false, reason: 'Already locked via auto-population' };
      }

      if (result && result.success && result.data?.isValid) {
        state.isVerified = true;
        state.isLocked = true; // Lock upon successful verification
        state.promoterName = result.data.promoterName || 'Verified Promoter';
        state.error = null;
        return { success: true, state: { ...state } };
      } else {
        state.isVerified = false;
        state.isLocked = false;
        state.error = result?.message || 'Invalid promocode. Please check and try again.';
        return { success: false, error: state.error, state: { ...state } };
      }
    },

    /**
     * Checks whether registration submission payload preserves the sponsor code.
     */
    getRegistrationBinding: () => {
      return {
        sponsor_code: state.code || null,
        promocode: state.code || null,
        isSponsorLocked: state.isLocked,
        isSponsorVerified: state.isVerified
      };
    }
  };
}

module.exports = {
  createSponsorLockStateMachine
};
