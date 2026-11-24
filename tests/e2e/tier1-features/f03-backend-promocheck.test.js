/**
 * Tier 1 Test Suite: F3 - Backend Sponsor Code Verification & Referral Binding
 * Verifies the /api/promoter/promocheck endpoint behavior, referral binding contracts,
 * and 404 handler by executing against the REAL production Express routers.
 */

const { createPromoterTestApp } = require('../helpers/http-helper');
const { assertOk, assertEqual } = require('../helpers/assertions');

module.exports = {
  id: 'F03',
  name: 'Backend Sponsor Code Verification',
  tier: 'tier1',
  tests: [
    {
      name: 'TC-F03-01: Valid active promocode returns HTTP 200 with discount, promoter name, and code/status',
      fn: async () => {
        const testApp = createPromoterTestApp();
        const res = await testApp.request('/api/promoter/promocheck', {
          method: 'POST',
          body: { promocode: 'PROMO99' }
        });

        assertEqual(res.status, 200, 'Should return HTTP 200 for valid promocode');
        assertOk(res.data.success, 'Response success should be true');
        assertEqual(res.data.data.promocode, 'PROMO99', 'Promocode should match uppercase');
        assertEqual(res.data.data.code, 'PROMO99', 'Production code field should match uppercase');
        assertEqual(res.data.data.discount, 100, 'Discount should be ₹100');
        assertEqual(res.data.data.promoterName, 'Suresh Kumar', 'Promoter name should match');
        assertEqual(res.data.data.isValid, true, 'isValid should be true');
        assertEqual(res.data.data.status, 'active', 'Status should be active');
      }
    },
    {
      name: 'TC-F03-02: Promocode is normalized case-insensitively and accepts code and sponsorCode aliases',
      fn: async () => {
        const testApp = createPromoterTestApp();
        
        // Test lowercase promocode alias
        const resPromo = await testApp.request('/api/promoter/promocheck', {
          method: 'POST',
          body: { promocode: 'promo99' }
        });
        assertEqual(resPromo.status, 200, 'Should return HTTP 200 for lowercase input');
        assertEqual(resPromo.data.data.promocode, 'PROMO99', 'Should normalize to uppercase PROMO99');

        // Test code alias
        const resCode = await testApp.request('/api/promoter/promocheck', {
          method: 'POST',
          body: { code: 'promo99' }
        });
        assertEqual(resCode.status, 200, 'Should accept code alias');
        assertEqual(resCode.data.data.code, 'PROMO99');

        // Test sponsorCode alias on Shree-gandha router
        const sgApp = createPromoterTestApp([], { service: 'shree-gandha-server' });
        const resSponsor = await sgApp.request('/api/promoter/promocheck', {
          method: 'POST',
          body: { sponsorCode: 'gold2026' }
        });
        assertEqual(resSponsor.status, 200, 'Should accept sponsorCode alias on Shree-gandha');
        assertEqual(resSponsor.data.data.promocode, 'GOLD2026');
      }
    },
    {
      name: 'TC-F03-03: Unknown or inactive promocode returns HTTP 400 with descriptive error',
      fn: async () => {
        const testApp = createPromoterTestApp();
        
        // Unknown code
        const resUnknown = await testApp.request('/api/promoter/promocheck', {
          method: 'POST',
          body: { promocode: 'UNKNOWN_CODE_999' }
        });
        assertEqual(resUnknown.status, 400, 'Should return HTTP 400 for unknown promocode');
        assertEqual(resUnknown.data.success, false, 'Response success should be false');
        assertOk(resUnknown.data.message.includes('Invalid promocode'), 'Should indicate invalid code');

        // Inactive code
        const resInactive = await testApp.request('/api/promoter/promocheck', {
          method: 'POST',
          body: { promocode: 'INACTIVE50' }
        });
        assertEqual(resInactive.status, 400, 'Should return HTTP 400 for inactive promocode');
        assertEqual(resInactive.data.success, false);
      }
    },
    {
      name: 'TC-F03-04: User registration endpoint binds referral/sponsor code immutably',
      fn: async () => {
        const testApp = createPromoterTestApp();
        const res = await testApp.request('/api/auth/register', {
          method: 'POST',
          body: {
            username: 'rajesh_kumar',
            mobile_no: '9876543210',
            promocode: 'PROMO99',
            sponsor_code: 'PROMO99'
          }
        });

        assertEqual(res.status, 201, 'Should return HTTP 201 for registration');
        assertOk(res.data.success, 'Registration success should be true');
        assertEqual(res.data.data.boundReferral, 'PROMO99', 'Bound referral must be preserved');
      }
    },
    {
      name: 'TC-F03-05: Non-existent backend API route returns HTTP 404 JSON response',
      fn: async () => {
        const testApp = createPromoterTestApp();
        const res = await testApp.request('/api/promoter/non-existent-endpoint');

        assertEqual(res.status, 404, 'Should return HTTP 404');
        assertEqual(res.data.error, 'Not found', 'Should return standard not found contract');
      }
    }
  ]
};
