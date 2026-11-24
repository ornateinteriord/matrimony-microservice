/**
 * Tier 1 Test Suite: F17 - Shree-ganda Mobile App-like Navigation
 * Verifies mobile viewport breakpoints, bottom navigation tab structure,
 * active tab state management, and temporary overlay drawer for Shree-ganda.
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
  id: 'F17',
  name: 'Shree-ganda Mobile App-like Navigation',
  tier: 'tier1',
  tests: [
    {
      name: 'TC-F17-01: Viewport breakpoint identifies mobile screens at <= 768px',
      fn: async () => {
        assertEqual(isMobileViewport(320), true);
        assertEqual(isMobileViewport(768), true);
        assertEqual(isMobileViewport(1024), false);
      }
    },
    {
      name: 'TC-F17-02: Bottom navigation declares 5 standard destination items',
      fn: async () => {
        const res = validateBottomNavConfig(STANDARD_MOBILE_TABS);
        assertOk(res.valid);
        assertEqual(res.tabCount, 5);
      }
    },
    {
      name: 'TC-F17-03: Active tab highlights current location pathname',
      fn: async () => {
        const navState = createMobileNavigationState(STANDARD_MOBILE_TABS, '/');
        assertEqual(navState.getActiveTab()?.id, 'home');
        navState.setActivePath('/interests');
        assertEqual(navState.getActiveTab()?.id, 'interests');
      }
    },
    {
      name: 'TC-F17-04: Temporary overlay drawer state toggles reliably on user touch',
      fn: async () => {
        const navState = createMobileNavigationState();
        assertEqual(navState.isDrawerOpen(), false);
        navState.toggleDrawer();
        assertEqual(navState.isDrawerOpen(), true);
      }
    },
    {
      name: 'TC-F17-05: Layout defines safe area padding for gesture-based devices',
      fn: async () => {
        const cssProperties = 'padding-bottom: env(safe-area-inset-bottom, 12px); width: 100%;';
        assertOk(validateSafeAreaRule(cssProperties), 'Safe area inset required with fallback');
      }
    }
  ]
};
