/**
 * Tier 2 Boundary Test Suite: F3 - Backend Promocheck Boundaries & Error Handling
 * Verifies empty inputs, whitespace, inactive promoters, malformed payloads, and 500 recovery.
 */

const { createPromoterTestApp } = require('../helpers/http-helper');
const { assertOk, assertEqual } = require('../helpers/assertions');

module.exports = {
  id: 'F03-BVA',
  name: 'Backend Promocheck Boundary & Negative Tests',
  tier: 'tier2',
  tests: [
    {
      name: 'TC-F03-B01: Request with empty object body returns HTTP 400 with "Promocode is required"',
      fn: async () => {
        const testApp = createPromoterTestApp();
        const res = await testApp.request('/api/promoter/promocheck', {
          method: 'POST',
          body: {}
        });

        assertEqual(res.status, 400, 'Must return 400');
        assertEqual(res.data.success, false);
        assertOk(res.data.message.includes('required'));
      }
    },
    {
      name: 'TC-F03-B02: Whitespace-only promocode string returns HTTP 400',
      fn: async () => {
        const testApp = createPromoterTestApp();
        const res = await testApp.request('/api/promoter/promocheck', {
          method: 'POST',
          body: { promocode: '     ' }
        });

        assertEqual(res.status, 400);
        assertEqual(res.data.success, false);
      }
    },
    {
      name: 'TC-F03-B03: Promocode belonging to inactive promoter is rejected with HTTP 400',
      fn: async () => {
        const testApp = createPromoterTestApp();
        const res = await testApp.request('/api/promoter/promocheck', {
          method: 'POST',
          body: { promocode: 'INACTIVE50' }
        });

        assertEqual(res.status, 400, 'Inactive promocode must return 400');
        assertEqual(res.data.success, false);
        assertOk(res.data.message.includes('Invalid promocode'));
      }
    },
    {
      name: 'TC-F03-B04: Malicious injection payloads are handled safely without unhandled exception',
      fn: async () => {
        const testApp = createPromoterTestApp();
        const payloads = ["' OR 1=1 --", '{"$gt": ""}', '<script>alert(1)</script>'];
        for (const p of payloads) {
          const res = await testApp.request('/api/promoter/promocheck', {
            method: 'POST',
            body: { promocode: p }
          });
          assertEqual(res.status, 400, `Payload "${p}" should return 400 invalid code`);
          assertEqual(res.data.success, false);
        }
      }
    },
    {
      name: 'TC-F03-B05: Simulated backend 500 error triggers graceful JSON error response',
      fn: async () => {
        const testApp = createPromoterTestApp();
        const res = await testApp.request('/api/trigger-error');

        assertEqual(res.status, 500, 'Must return 500');
        assertEqual(res.data.error, 'Internal server error');
        assertOk(res.data.message.includes('Simulated'), 'Should return error message');
      }
    }
  ]
};
