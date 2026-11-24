/**
 * Tier 4 Real-World Scenario 2: Manual Sponsor Code Verification Flow
 * Multi-step simulation of a user typing a promoter code during registration:
 * 1. User navigates to `/register` without query params.
 * 2. Sponsor input starts unlocked and unverified.
 * 3. User types a promocode with mixed casing and spaces: "  gold2026  ".
 * 4. User triggers manual verification check.
 * 5. Backend responds with 200 OK, promoter name, and ₹100 discount.
 * 6. Input field locks permanently (`disabled=true`), displays verified badge and promoter name.
 * 7. User completes registration; backend records attribution.
 */

const { createSponsorLockStateMachine } = require('../helpers/sponsor-lock');
const { createPromoterTestApp } = require('../helpers/http-helper');
const { assertOk, assertEqual } = require('../helpers/assertions');

module.exports = {
  id: 'JOURNEY-02',
  name: 'Manual Sponsor Code Verification Flow',
  tier: 'tier4',
  tests: [
    {
      name: 'Scenario 2: Complete manual sponsor verification and registration binding flow',
      fn: async () => {
        const testApp = createPromoterTestApp();

        // Step 1: User arrives without query params
        const sponsorSm = createSponsorLockStateMachine('');
        const initial = sponsorSm.getState();

        assertEqual(initial.code, '');
        assertEqual(initial.isLocked, false, 'Manual entry must start unlocked');
        assertEqual(initial.isVerified, false, 'Manual entry starts unverified');

        // Step 2: User types code with spaces and lowercase
        const inputRes = sponsorSm.updateInput('  gold2026  ');
        assertOk(inputRes.success);
        assertEqual(sponsorSm.getState().code, 'GOLD2026', 'Normalized to GOLD2026');

        // Step 3: Frontend dispatches promocheck API request
        const apiRes = await testApp.request('/api/promoter/promocheck', {
          method: 'POST',
          body: { promocode: sponsorSm.getState().code }
        });

        assertEqual(apiRes.status, 200, 'API check must return 200 OK');
        assertOk(apiRes.data.success);
        assertEqual(apiRes.data.data.promoterName, 'Ananya Sharma');
        assertEqual(apiRes.data.data.discount, 100);

        // Step 4: Apply verification result to state machine
        const lockRes = sponsorSm.applyVerificationResult(apiRes.data);
        assertOk(lockRes.success);

        // Step 5: Verify input field is now permanently locked
        const postLock = sponsorSm.getState();
        assertEqual(postLock.isLocked, true, 'Field must be locked after successful check');
        assertEqual(postLock.isVerified, true, 'Field must be marked verified');
        assertEqual(postLock.promoterName, 'Ananya Sharma');

        // Step 6: User attempts to edit code post-verification; rejected
        const editAttempt = sponsorSm.updateInput('ANOTHER_CODE');
        assertEqual(editAttempt.success, false, 'Cannot edit post-verification');

        // Step 7: Form submitted with bound promoter attribution
        const regRes = await testApp.request('/api/auth/register', {
          method: 'POST',
          body: {
            username: 'priya_k',
            mobile_no: '9845099887',
            ...sponsorSm.getRegistrationBinding()
          }
        });

        assertEqual(regRes.status, 201);
        assertEqual(regRes.data.data.boundReferral, 'GOLD2026');
      }
    }
  ]
};
