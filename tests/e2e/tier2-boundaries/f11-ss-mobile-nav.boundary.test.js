/**
 * Tier 2 Boundary Test Suite: F11 - Sangam-sathi Mobile Navigation Boundaries
 * Verifies breakpoint edge conditions, malformed tabs, extreme viewports, and drawer toggle stability.
 */

const {
  isMobileViewport,
  validateBottomNavConfig,
  createMobileNavigationState
} = require('../helpers/mobile-navigation');
const { assertOk, assertEqual } = require('../helpers/assertions');

module.exports = {
  id: 'F11-BVA',
  name: 'Sangam-sathi Mobile Navigation Boundaries',
  tier: 'tier2',
  tests: [
    {
      name: 'TC-F11-B01: Viewport breakpoint boundary evaluation at 768px vs 769px',
      fn: async () => {
        assertEqual(isMobileViewport(768), true);
        assertEqual(isMobileViewport(769), false);
      }
    },
    {
      name: 'TC-F11-B02: Malformed bottom tab missing path is rejected by validator',
      fn: async () => {
        const malformedTabs = [
          { id: 'home', label: 'Home' } // Missing path
        ];
        const res = validateBottomNavConfig(malformedTabs);
        assertEqual(res.valid, false, 'Tab missing path must be invalid');
      }
    },
    {
      name: 'TC-F11-B03: Ultra-narrow fold mobile device (280px) is recognized as mobile',
      fn: async () => {
        assertEqual(isMobileViewport(280), true, '280px fold screen must be mobile');
      }
    },
    {
      name: 'TC-F11-B04: High frequency drawer toggling maintains deterministic boolean state',
      fn: async () => {
        const navState = createMobileNavigationState();
        for (let i = 0; i < 50; i++) {
          navState.toggleDrawer();
        }
        // Even number of toggles leaves drawer closed (initial was false)
        assertEqual(navState.isDrawerOpen(), false, 'Drawer should be closed after 50 toggles');
      }
    },
    {
      name: 'TC-F11-B05: Tab validator rejects non-array input',
      fn: async () => {
        const res = validateBottomNavConfig('invalid-input');
        assertEqual(res.valid, false, 'String input must be rejected');
      }
    }
  ]
};
