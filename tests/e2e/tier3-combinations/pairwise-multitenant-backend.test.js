/**
 * Tier 3 Combinatorial Suite: Pairwise Multi-Tenant Backend + Promoter Verification
 * Tests cross-feature interactions between F3 (Backend) and tenant identification headers
 * across Girija-Kalyana, Sangam-sathi, and Shree-ganda using REAL Express routers.
 */

const { createPromoterTestApp } = require('../helpers/http-helper');
const { assertOk, assertEqual } = require('../helpers/assertions');

module.exports = {
  id: 'TIER3-MULTITENANT-BACKEND',
  name: 'Pairwise Multi-Tenant Backend + Promoter Verification',
  tier: 'tier3',
  tests: [
    {
      name: 'TC-T3-19: Promocheck with x-project: Girija-Kalyana header validates promoter and resolves tenant',
      fn: async () => {
        const testApp = createPromoterTestApp();
        const res = await testApp.request('/api/promoter/promocheck', {
          method: 'POST',
          headers: { 'x-project': 'Girija-Kalyana' },
          body: { promocode: 'PROMO99' }
        });

        assertEqual(res.status, 200);
        assertEqual(res.data.data.promocode, 'PROMO99');
        assertEqual(res.headers['x-project-resolved'], 'Girija-Kalyana', 'Must resolve Girija-Kalyana tenant');
      }
    },
    {
      name: 'TC-T3-20: Promocheck with x-project: Sangam-sathi header resolves valid promocode and tenant',
      fn: async () => {
        const testApp = createPromoterTestApp();
        const res = await testApp.request('/api/promoter/promocheck', {
          method: 'POST',
          headers: { 'x-project': 'Sangam-sathi' },
          body: { promocode: 'GOLD2026' }
        });

        assertEqual(res.status, 200);
        assertEqual(res.data.data.promoterName, 'Ananya Sharma');
        assertEqual(res.headers['x-project-resolved'], 'Sangam-Sathi', 'Must resolve Sangam-Sathi tenant');
      }
    },
    {
      name: 'TC-T3-21: Promocheck with x-project: Shree-ganda header resolves valid promocode on Shree-gandha router',
      fn: async () => {
        const testApp = createPromoterTestApp([
          { promoter_id: 'SHREE2026', promoter_name: 'Shree Agent', status: 'active' }
        ]);
        const res = await testApp.request('/api/promoter/promocheck', {
          method: 'POST',
          headers: { 'x-project': 'Shree-ganda' },
          body: { promocode: 'SHREE2026' }
        });

        assertEqual(res.status, 200);
        assertEqual(res.data.data.promoterName, 'Shree Agent');
        assertEqual(res.headers['x-project-resolved'], 'Shree-Ganda', 'Must resolve Shree-Ganda tenant');
      }
    },
    {
      name: 'TC-T3-22: Missing tenant header defaults safely without throwing unhandled exception',
      fn: async () => {
        const testApp = createPromoterTestApp();
        const res = await testApp.request('/api/promoter/promocheck', {
          method: 'POST',
          body: { promocode: 'PROMO99' }
        });

        assertEqual(res.status, 200, 'Must process cleanly even if tenant header omitted');
        assertOk(res.headers['x-project-resolved'], 'Must set default resolved tenant header');
      }
    },
    {
      name: 'TC-T3-23: Multi-tenant user registration binds referral code under tenant project namespace',
      fn: async () => {
        const testApp = createPromoterTestApp();
        const res = await testApp.request('/api/auth/register', {
          method: 'POST',
          headers: { 'x-project': 'Girija-Kalyana' },
          body: {
            username: 'girija_bride_01',
            mobile_no: '9845112233',
            promocode: 'PROMO99'
          }
        });

        assertEqual(res.status, 201);
        assertEqual(res.data.data.boundReferral, 'PROMO99');
        assertEqual(res.data.data.tenant, 'Girija-Kalyana');
        assertEqual(res.data.data.projectName, 'Girija-Kalyana');
      }
    },
    {
      name: 'TC-T3-24: Non-existent endpoint returns consistent 404 across any multi-tenant header',
      fn: async () => {
        const testApp = createPromoterTestApp();
        const tenants = ['Girija-Kalyana', 'Sangam-sathi', 'Shree-ganda'];
        for (const tenant of tenants) {
          const res = await testApp.request('/api/unknown-tenant-route', {
            headers: { 'x-project': tenant }
          });
          assertEqual(res.status, 404, `Tenant ${tenant} unknown route should return 404`);
        }
      }
    }
  ]
};
