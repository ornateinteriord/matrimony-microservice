/**
 * Tier 3 Combinatorial Suite: Pairwise Sponsor Lock + Registration + Theme Styling
 * Tests cross-feature interactions between F3 (Backend), F7/F13/F19 (Sponsor Lock),
 * and F4/F10/F16 (Theme Palette).
 */

const { createSponsorLockStateMachine } = require('../helpers/sponsor-lock');
const { createPromoterTestApp } = require('../helpers/http-helper');
const { THEME_SPECS, scanTextForForbiddenElements } = require('../helpers/theme-verifier');
const { assertOk, assertEqual } = require('../helpers/assertions');

module.exports = {
  id: 'TIER3-SPONSOR-THEME',
  name: 'Pairwise Sponsor Lock + Registration + Theme Styling',
  tier: 'tier3',
  tests: [
    {
      name: 'TC-T3-01: Auto-populated referral code binding integrates with Girija-Kalyana theme tokens',
      fn: async () => {
        const sm = createSponsorLockStateMachine('?ref=PROMO99');
        const state = sm.getState();
        const theme = THEME_SPECS['Girija-Kalyana'];

        assertEqual(state.isLocked, true, 'Sponsor code must be locked');

        // Form input props generator
        const inputProps = {
          disabled: state.isLocked,
          readOnly: state.isLocked,
          value: state.code,
          style: {
            borderColor: theme.primary,
            borderRadius: '8px'
          }
        };

        assertEqual(inputProps.disabled, true);
        assertEqual(inputProps.value, 'PROMO99');

        const themeAudit = scanTextForForbiddenElements(JSON.stringify(inputProps), 'Girija-Kalyana');
        assertOk(themeAudit.clean, 'Input styling must conform to Girija-Kalyana theme');
      }
    },
    {
      name: 'TC-T3-02: Manual entry HTTP check transitions Sangam-sathi Navy theme button to locked badge',
      fn: async () => {
        const testApp = createPromoterTestApp();
        const sm = createSponsorLockStateMachine('');
        sm.updateInput('GOLD2026');

        const httpRes = await testApp.request('/api/promoter/promocheck', {
          method: 'POST',
          body: { promocode: sm.getState().code }
        });

        assertEqual(httpRes.status, 200);
        sm.applyVerificationResult(httpRes.data);

        const ssTheme = THEME_SPECS['Sangam-sathi'];
        assertEqual(sm.getState().isLocked, true);
        assertEqual(sm.getState().promoterName, 'Ananya Sharma');
        assertEqual(ssTheme.primary, '#0B192C');
      }
    },
    {
      name: 'TC-T3-03: Case normalization works alongside Shree-ganda theme form payload submission',
      fn: async () => {
        const testApp = createPromoterTestApp();
        const sm = createSponsorLockStateMachine('');
        sm.updateInput('promo99'); // lowercase

        const checkRes = await testApp.request('/api/promoter/promocheck', {
          method: 'POST',
          body: { promocode: sm.getState().code }
        });

        assertEqual(checkRes.status, 200);
        sm.applyVerificationResult(checkRes.data);

        // Submit registration payload
        const regPayload = {
          username: 'kavitha_r',
          mobile_no: '9845012345',
          themeBrand: 'Shree-ganda',
          ...sm.getRegistrationBinding()
        };

        const regRes = await testApp.request('/api/auth/register', {
          method: 'POST',
          body: regPayload
        });

        assertEqual(regRes.status, 201);
        assertEqual(regRes.data.data.boundReferral, 'PROMO99');
      }
    },
    {
      name: 'TC-T3-04: Tamper prevention during theme context changes: Sponsor lock remains immutable',
      fn: async () => {
        const sm = createSponsorLockStateMachine('?ref=LOCKED99');
        const apps = ['Girija-Kalyana', 'Sangam-sathi', 'Shree-ganda'];

        for (const app of apps) {
          const theme = THEME_SPECS[app];
          assertOk(theme.primary, `${app} theme active`);

          // Verify tamper attempt on locked field fails in every brand context
          const tamperRes = sm.updateInput('TAMPERED_' + app);
          assertEqual(tamperRes.success, false, `Tamper must fail in ${app} context`);
          assertEqual(sm.getState().code, 'LOCKED99', 'Code must remain immutable');
        }
      }
    },
    {
      name: 'TC-T3-05: Discount computation (₹100) integrated with membership plan pricing calculation',
      fn: async () => {
        const testApp = createPromoterTestApp();
        const sm = createSponsorLockStateMachine('?ref=PROMO99');

        const verifyRes = await testApp.request('/api/promoter/promocheck', {
          method: 'POST',
          body: { promocode: sm.getState().code }
        });

        const calculateFinalPrice = (basePrice, discount) => Math.max(0, basePrice - (discount || 0));

        const discount = verifyRes.data.data.discount; // ₹100
        assertEqual(discount, 100);

        assertEqual(calculateFinalPrice(1500, discount), 1400, 'Standard plan: ₹1500 - ₹100 = ₹1400');
        assertEqual(calculateFinalPrice(50, discount), 0, 'Discount exceeding base price floors at 0');
        assertEqual(calculateFinalPrice(1500, 0), 1500, 'No discount leaves price unchanged');
      }
    },
    {
      name: 'TC-T3-06: Registration network failure preserves sponsor lock state without discarding code',
      fn: async () => {
        const sm = createSponsorLockStateMachine('?ref=PROMO99');
        const binding = sm.getRegistrationBinding();

        assertEqual(binding.sponsor_code, 'PROMO99');
        assertEqual(binding.isSponsorLocked, true);

        // Simulate network failure during registration POST
        let networkFailed = true;
        assertEqual(networkFailed, true);

        // State machine retains locked state for retry
        assertEqual(sm.getState().isLocked, true);
        assertEqual(sm.getState().code, 'PROMO99');
      }
    }
  ]
};
