/**
 * Tier 2 Boundary Test Suite: F17 - Shree-ganda Mobile Navigation Boundaries
 * Verifies breakpoint transitions, empty tab labels, missing icons, and safe area bounds.
 */

const {
  isMobileViewport,
  validateBottomNavConfig,
  createMobileNavigationState,
  validateSafeAreaRule
} = require('../helpers/mobile-navigation');
const { assertOk, assertEqual } = require('../helpers/assertions');

module.exports = {
  id: 'F17-BVA',
  name: 'Shree-ganda Mobile Navigation Boundaries',
  tier: 'tier2',
  tests: [
    {
      name: 'TC-F17-B01: Breakpoint boundary transition at 768px vs 769px',
      fn: async () => {
        assertEqual(isMobileViewport(768), true, '768px is mobile');
        assertEqual(isMobileViewport(769), false, '769px is desktop');
      }
    },
    {
      name: 'TC-F17-B02: Bottom tab with empty string label is rejected by validator',
      fn: async () => {
        const invalidTabs = [
          { id: 'home', label: '', path: '/' }
        ];
        const res = validateBottomNavConfig(invalidTabs);
        assertEqual(res.valid, false, 'Tab with empty label must be rejected');
      }
    },
    {
      name: 'TC-F17-B03: Missing id in tab definition is rejected by validator',
      fn: async () => {
        const invalidTabs = [
          { label: 'Home', path: '/' }
        ];
        const res = validateBottomNavConfig(invalidTabs);
        assertEqual(res.valid, false, 'Tab without id must be rejected');
      }
    },
    {
      name: 'TC-F17-B04: Navigation state maintains integrity when initialized with custom tabs',
      fn: async () => {
        const customTabs = [
          { id: 'tab1', label: 'T1', path: '/t1' },
          { id: 'tab2', label: 'T2', path: '/t2' }
        ];
        const navState = createMobileNavigationState(customTabs, '/t1');
        assertEqual(navState.getActiveTab()?.id, 'tab1');
        assertEqual(navState.getTabs().length, 2);
      }
    },
    {
      name: 'TC-F17-B05: Safe area CSS fallback syntax validation',
      fn: async () => {
        assertOk(validateSafeAreaRule('padding-bottom: env(safe-area-inset-bottom, 16px);'), 'Valid rule with 16px fallback');
        assertOk(!validateSafeAreaRule('padding-bottom: env(safe-area-inset-bottom);'), 'Rule without fallback must fail');
        assertOk(!validateSafeAreaRule('padding-bottom: 16px;'), 'Static rule without env must fail');
      }
    }
  ]
};
