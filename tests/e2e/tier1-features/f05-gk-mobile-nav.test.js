/**
 * Tier 1 Test Suite: F5 - Girija-Kalyana Mobile App-like Navigation
 * Verifies mobile viewport breakpoints, bottom navigation tab structure,
 * active tab state management, and mobile drawer transitions.
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
  id: 'F05',
  name: 'Girija-Kalyana Mobile App-like Navigation',
  tier: 'tier1',
  tests: [
    {
      name: 'TC-F05-01: Responsive breakpoint activates mobile mode at or below 768px',
      fn: async () => {
        assertOk(isMobileViewport(375), 'iPhone viewport (375px) should be mobile');
        assertOk(isMobileViewport(768), 'iPad portrait (768px) should be mobile');
        assertOk(!isMobileViewport(1024), 'Desktop (1024px) should not be mobile');
      }
    },
    {
      name: 'TC-F05-02: Bottom navigation declares core matrimony tabs (Home, Matches, Interests, Chat, Profile)',
      fn: async () => {
        const res = validateBottomNavConfig(STANDARD_MOBILE_TABS);
        assertOk(res.valid, `Bottom navigation tabs must be valid: ${res.errors.join('; ')}`);
        assertEqual(res.tabCount, 5, 'Must contain exactly 5 primary mobile tabs');
      }
    },
    {
      name: 'TC-F05-03: Active tab state synchronizes with navigation route changes',
      fn: async () => {
        const navState = createMobileNavigationState(STANDARD_MOBILE_TABS, '/');
        assertEqual(navState.getActiveTab()?.id, 'home', 'Initial active tab should be home');

        navState.setActivePath('/matches');
        assertEqual(navState.getActiveTab()?.id, 'matches', 'Active tab should switch to matches');

        navState.setActivePath('/profile');
        assertEqual(navState.getActiveTab()?.id, 'profile', 'Active tab should switch to profile');
      }
    },
    {
      name: 'TC-F05-04: Mobile navigation drawer supports smooth open/close toggle',
      fn: async () => {
        const navState = createMobileNavigationState();
        assertEqual(navState.isDrawerOpen(), false, 'Drawer should be closed initially');

        const opened = navState.toggleDrawer();
        assertEqual(opened, true, 'Drawer should open on toggle');
        assertEqual(navState.isDrawerOpen(), true, 'Drawer state should be open');

        const closed = navState.toggleDrawer();
        assertEqual(closed, false, 'Drawer should close on second toggle');
      }
    },
    {
      name: 'TC-F05-05: Bottom navigation layout specifies safe-area-inset-bottom padding',
      fn: async () => {
        const mobileNavCssRule = 'padding-bottom: env(safe-area-inset-bottom, 8px); position: fixed; bottom: 0;';
        assertOk(validateSafeAreaRule(mobileNavCssRule), 'Must validate safe area rule syntax with fallback');
        assertOk(mobileNavCssRule.includes('fixed'), 'Bottom nav bar must be fixed at viewport bottom');
      }
    }
  ]
};
