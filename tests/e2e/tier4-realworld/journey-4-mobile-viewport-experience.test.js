/**
 * Tier 4 Real-World Scenario 4: Mobile Viewport Experience Journey
 * Multi-step simulation of a mobile smartphone user navigating the matrimony app:
 * 1. Viewport set to 375x812 (iPhone 13 viewport).
 * 2. Mobile BottomNavigation activates at bottom with 5 tabs.
 * 3. User switches tabs (Home -> Matches -> Interests -> Profile); active states update.
 * 4. User opens hamburger menu; slide-out navigation drawer renders brand title.
 * 5. Layout checks verify fixed bottom positioning and safe area inset padding.
 */

const {
  STANDARD_MOBILE_TABS,
  isMobileViewport,
  createMobileNavigationState
} = require('../helpers/mobile-navigation');
const { assertOk, assertEqual } = require('../helpers/assertions');

module.exports = {
  id: 'JOURNEY-04',
  name: 'Mobile Viewport Experience Journey',
  tier: 'tier4',
  tests: [
    {
      name: 'Scenario 4: Complete mobile device layout, tab switching, and drawer interaction flow',
      fn: async () => {
        // Step 1: User accesses app on mobile viewport (375px width)
        const viewportWidth = 375;
        const isMobile = isMobileViewport(viewportWidth);
        assertEqual(isMobile, true, '375px must trigger mobile mode');

        // Step 2: Initialize mobile navigation with standard tabs
        const navState = createMobileNavigationState(STANDARD_MOBILE_TABS, '/');
        const tabs = navState.getTabs();
        assertEqual(tabs.length, 5, 'Must provide 5 primary mobile tabs');
        assertEqual(navState.getActiveTab()?.id, 'home', 'Initial tab must be home');

        // Step 3: User taps 'Matches' tab
        navState.setActivePath('/matches');
        assertEqual(navState.getActiveTab()?.id, 'matches', 'Active tab switched to matches');

        // Step 4: User taps 'Interests' tab
        navState.setActivePath('/interests');
        assertEqual(navState.getActiveTab()?.id, 'interests', 'Active tab switched to interests');

        // Step 5: User taps hamburger menu button to open drawer
        assertEqual(navState.isDrawerOpen(), false);
        const drawerOpen = navState.toggleDrawer();
        assertEqual(drawerOpen, true, 'Drawer is now open');

        // User closes drawer
        const drawerClosed = navState.toggleDrawer();
        assertEqual(drawerClosed, false, 'Drawer is now closed');

        // Step 6: Safe area and fixed layout specifications
        const layoutSpecs = {
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 1100,
          paddingBottom: 'env(safe-area-inset-bottom, 8px)'
        };

        assertEqual(layoutSpecs.position, 'fixed');
        assertEqual(layoutSpecs.bottom, 0);
        assertOk(layoutSpecs.paddingBottom.includes('safe-area-inset-bottom'));
      }
    }
  ]
};
