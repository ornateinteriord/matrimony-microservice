/**
 * Tier 4 Real-World Scenario 1: Referral Link Onboarding Journey
 * Multi-step simulation of a new user arriving through an affiliate referral link:
 * 1. User arrives on `/register?ref=PROMO99`.
 * 2. System detects query parameter, auto-populates code, and locks the input field immediately.
 * 3. User attempts to edit code; mutation is blocked.
 * 4. User completes registration form fields (username, mobile number, plan).
 * 5. User submits form; payload immutably binds the referral sponsor code.
 * 6. Backend confirms successful registration with bound affiliate attribution.
 */

const { createSponsorLockStateMachine } = require('../helpers/sponsor-lock');
const { createPromoterTestApp } = require('../helpers/http-helper');
const { THEME_SPECS } = require('../helpers/theme-verifier');
const { assertOk, assertEqual } = require('../helpers/assertions');

module.exports = {
  id: 'JOURNEY-01',
  name: 'Referral Link Onboarding Journey',
  tier: 'tier4',
  tests: [
    {
      name: 'Scenario 1: Complete end-to-end referral onboarding lifecycle',
      fn: async () => {
        const testApp = createPromoterTestApp();

        // Step 1: User navigates to registration page with referral link
        const arrivalUrl = 'https://girijakalyana.com/register?ref=PROMO99&type=PremiumUser';
        const searchParams = new URL(arrivalUrl).search;

        // Step 2: Sponsor state machine initializes
        const sponsorSm = createSponsorLockStateMachine(searchParams);
        const state1 = sponsorSm.getState();

        assertEqual(state1.code, 'PROMO99', 'Sponsor code must be PROMO99');
        assertEqual(state1.isLocked, true, 'Sponsor input must be locked immediately');
        assertEqual(state1.isAutoPopulated, true, 'isAutoPopulated flag must be true');

        // Step 3: User attempts to edit the locked sponsor field
        const tamperAttempt = sponsorSm.updateInput('MALICIOUS_CODE');
        assertEqual(tamperAttempt.success, false, 'Tamper attempt on locked field must fail');
        assertEqual(sponsorSm.getState().code, 'PROMO99', 'Code must remain original');

        // Step 4: User fills profile form
        const userFormData = {
          username: 'rohit_sharma_99',
          mobile_no: '9845198765',
          gender: 'Male',
          religion: 'Hindu',
          marital_status: 'Never Married',
          planType: 'PremiumUser'
        };

        // Step 5: Form submission payload prepared with bound sponsor code
        const registrationPayload = {
          ...userFormData,
          ...sponsorSm.getRegistrationBinding()
        };

        assertEqual(registrationPayload.sponsor_code, 'PROMO99');
        assertEqual(registrationPayload.isSponsorLocked, true);

        // Step 6: Backend registration endpoint invocation
        const regRes = await testApp.request('/api/auth/register', {
          method: 'POST',
          body: registrationPayload
        });

        assertEqual(regRes.status, 201, 'Registration must succeed with HTTP 201');
        assertOk(regRes.data.success, 'Registration success flag must be true');
        assertEqual(regRes.data.data.boundReferral, 'PROMO99', 'Referral binding must be persisted in database');
      }
    }
  ]
};
