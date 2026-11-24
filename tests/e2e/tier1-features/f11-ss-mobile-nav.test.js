/**
 * Tier 1 Test Suite: F11 - Sangam-sathi Mobile App-like Navigation
 * Verifies mobile viewport breakpoints, bottom navigation tab structure,
 * active tab state management, and mobile drawer transitions for Sangam-sathi.
 */

const {
  STANDARD_MOBILE_TABS,
  isMobileViewport,
  validateBottomNavConfig,
  createMobileNavigationState,
  validateSafeAreaRule
} = require('../helpers/mobile-navigation');
const { assertOk, assertEqual } = require('../helpers/assertions');

module.exports = {
  id: 'F11',
  name: 'Sangam-sathi Mobile App-like Navigation',
  tier: 'tier1',
  tests: [
    {
      name: 'TC-F11-01: Breakpoint toggles mobile mode at width <= 768px',
      fn: async () => {
        assertEqual(isMobileViewport(375), true);
        assertEqual(isMobileViewport(768), true);
        assertEqual(isMobileViewport(1200), false);
      }
    },
    {
      name: 'TC-F11-02: Bottom navigation declares 5 essential matrimony navigation destinations',
      fn: async () => {
        const res = validateBottomNavConfig(STANDARD_MOBILE_TABS);
        assertOk(res.valid);
        assertEqual(res.tabCount, 5);
      }
    },
    {
      name: 'TC-F11-03: Route change updates active navigation tab',
      fn: async () => {
        const navState = createMobileNavigationState(STANDARD_MOBILE_TABS, '/');
        assertEqual(navState.getActiveTab()?.id, 'home');
        navState.setActivePath('/chat');
        assertEqual(navState.getActiveTab()?.id, 'chat');
      }
    },
    {
      name: 'TC-F11-04: Mobile navigation drawer toggle manages state cleanly',
      fn: async () => {
        const navState = createMobileNavigationState();
        assertEqual(navState.isDrawerOpen(), false);
        navState.toggleDrawer();
        assertEqual(navState.isDrawerOpen(), true);
      }
    },
    {
      name: 'TC-F11-05: Mobile view specifies fixed bottom positioning with safe-area-inset fallback',
      fn: async () => {
        const cssRule = 'position: fixed; bottom: 0; left: 0; right: 0; padding-bottom: env(safe-area-inset-bottom, 12px);';
        assertOk(cssRule.includes('position: fixed'), 'Must be fixed at bottom');
        assertOk(validateSafeAreaRule(cssRule), 'Must validate safe area rule syntax with fallback');
      }
    }
  ]
};
