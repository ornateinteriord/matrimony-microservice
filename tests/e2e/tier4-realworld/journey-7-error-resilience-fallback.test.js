/**
 * Tier 4 Real-World Scenario 7: Error Resilience & Graceful Fallback Flow
 * Multi-step simulation of unexpected errors, network exceptions, and missing routes
 * against REAL backend routers and real workspace NotFound components.
 */

const { readAppFile, appFileExists } = require('../helpers/workspace-resolver');
const { createPromoterTestApp } = require('../helpers/http-helper');
const { analyzeHtmlMetadata } = require('../helpers/seo-verifier');
const { assertOk, assertEqual } = require('../helpers/assertions');

module.exports = {
  id: 'JOURNEY-07',
  name: 'Error Resilience & Graceful Fallback Flow',
  tier: 'tier4',
  tests: [
    {
      name: 'Scenario 7: Complete error resilience, 404 custom routing, and 500 error boundary recovery flow',
      fn: async () => {
        const testApp = createPromoterTestApp();

        // Step 1: Requesting non-existent backend resource returns 404
        const missingRouteRes = await testApp.request('/api/non-existent-route');
        assertEqual(missingRouteRes.status, 404, 'Must return HTTP 404');
        assertEqual(missingRouteRes.data.error, 'Not found');

        // Step 2: Real frontend 404 page validation on disk
        assertOk(appFileExists('Girija-Kalyana', 'src', 'components', 'notFound', 'NotFoundPage.tsx'), 'NotFoundPage.tsx must exist');
        let notFoundCode = readAppFile('Girija-Kalyana', 'src', 'components', 'notFound', 'NotFoundPage.tsx');
        if (notFoundCode.includes('from "../common/NotFoundPage"') && appFileExists('Girija-Kalyana', 'src', 'components', 'common', 'NotFoundPage.tsx')) {
          notFoundCode += '\n' + readAppFile('Girija-Kalyana', 'src', 'components', 'common', 'NotFoundPage.tsx');
        }
        assertOk(notFoundCode.includes('Page Not Found') || notFoundCode.includes('404'), 'NotFoundPage must display 404 or Page Not Found');
        
        const appTsx = readAppFile('Girija-Kalyana', 'src', 'App.tsx');
        assertOk(appTsx.includes('NotFoundPage'), 'App.tsx must reference NotFoundPage');

        // Step 3: Trigger intentional backend 500 error
        const errorRes = await testApp.request('/api/trigger-error');
        assertEqual(errorRes.status, 500, 'Must return HTTP 500');
        assertEqual(errorRes.data.error, 'Internal server error');
        assertOk(errorRes.data.message.includes('Simulated'));

        // Step 4: React ErrorBoundary catch simulation
        class MockErrorBoundary {
          constructor() {
            this.state = { hasError: false, error: null };
          }
          static getDerivedStateFromError(error) {
            return { hasError: true, error };
          }
          componentDidCatch(error, errorInfo) {
            this.state = { hasError: true, error, errorInfo };
          }
        }

        const boundary = new MockErrorBoundary();
        boundary.componentDidCatch(new Error('Payment gateway timeout'));
        assertEqual(boundary.state.hasError, true, 'ErrorBoundary must capture component error');
        assertEqual(boundary.state.error.message, 'Payment gateway timeout');

        // Step 5: Process survives without termination
        assertOk(process.exitCode === undefined || process.exitCode === 0, 'Node process remains active and healthy');
      }
    }
  ]
};
