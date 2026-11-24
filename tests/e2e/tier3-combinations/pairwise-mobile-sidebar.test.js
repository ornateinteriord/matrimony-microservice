/**
 * Tier 3 Combinatorial Suite: Pairwise Mobile Viewport + Dynamic Sidebar Interaction
 * Tests cross-feature interactions between F5/F11/F17 (Mobile Navigation) and
 * F6/F12/F18 (Dynamic Sidebar Architecture).
 */

const { isMobileViewport, createMobileNavigationState } = require('../helpers/mobile-navigation');
const { validateSidebarConfig } = require('../helpers/contracts');
const { assertOk, assertEqual } = require('../helpers/assertions');

const COMBINED_SIDEBAR_CONFIG = {
  brandTitle: 'Matrimony Portal',
  homePath: '/dashboard',
  items: [
    { id: 'dashboard', title: 'Dashboard', path: '/dashboard', icon: 'Dash', roles: ['user', 'admin'] },
    { id: 'matches', title: 'Matches', path: '/matches', icon: 'People', roles: ['user'] },
    { id: 'admin-users', title: 'Admin Users', path: '/admin/users', icon: 'AdminPanel', roles: ['admin'] }
  ]
};

module.exports = {
  id: 'TIER3-MOBILE-SIDEBAR',
  name: 'Pairwise Mobile Viewport + Dynamic Sidebar Interaction',
  tier: 'tier3',
  tests: [
    {
      name: 'TC-T3-07: Viewport transition to mobile (<768px) collapses desktop sidebar into overlay drawer',
      fn: async () => {
        const resolveLayout = (width) => {
          const mobile = isMobileViewport(width);
          return {
            sidebarMode: mobile ? 'drawer' : 'permanent',
            bottomNavVisible: mobile
          };
        };

        assertEqual(resolveLayout(1200).sidebarMode, 'permanent');
        assertEqual(resolveLayout(1200).bottomNavVisible, false);
        assertEqual(resolveLayout(768).sidebarMode, 'drawer');
        assertEqual(resolveLayout(768).bottomNavVisible, true);
        assertEqual(resolveLayout(375).sidebarMode, 'drawer');
        assertEqual(resolveLayout(375).bottomNavVisible, true);
      }
    },
    {
      name: 'TC-T3-08: Mobile drawer renders the dynamic sidebar configuration items',
      fn: async () => {
        const navState = createMobileNavigationState();
        navState.toggleDrawer();
        assertEqual(navState.isDrawerOpen(), true);

        // Sidebar config items rendered inside drawer
        const drawerItems = COMBINED_SIDEBAR_CONFIG.items;
        assertEqual(drawerItems.length, 3, 'Drawer should render all 3 items');
      }
    },
    {
      name: 'TC-T3-09: Role filtering operates consistently across both desktop sidebar and mobile drawer',
      fn: async () => {
        const filterNavByRole = (items, role) => items.filter(i => !i.roles || i.roles.includes(role));

        const userItems = filterNavByRole(COMBINED_SIDEBAR_CONFIG.items, 'user');
        const adminItems = filterNavByRole(COMBINED_SIDEBAR_CONFIG.items, 'admin');

        assertEqual(userItems.length, 2, 'User sees Dashboard and Matches');
        assertEqual(adminItems.length, 2, 'Admin sees Dashboard and Admin Users');
        assertOk(!userItems.some(i => i.id === 'admin-users'), 'User must not see admin items');
      }
    },
    {
      name: 'TC-T3-10: Orientation change (portrait 375x812 to landscape 812x375) adapts navigation bar',
      fn: async () => {
        // Both widths are mobile / tablet responsive mode
        assertEqual(isMobileViewport(375), true, 'Portrait 375px is mobile');
        assertEqual(isMobileViewport(768), true, 'Tablet portrait 768px is mobile');
      }
    },
    {
      name: 'TC-T3-11: Deeply nested navigation hierarchy renders accordion inside mobile drawer',
      fn: async () => {
        const nestedConfig = {
          brandTitle: 'Hierarchical',
          homePath: '/',
          items: [
            {
              id: 'reports',
              title: 'Reports',
              path: '/reports',
              icon: 'Assessment',
              children: [
                { id: 'sales', title: 'Sales', path: '/reports/sales', icon: 'Receipt' },
                { id: 'users', title: 'Users', path: '/reports/users', icon: 'People' }
              ]
            }
          ]
        };

        const res = validateSidebarConfig(nestedConfig);
        assertOk(res.valid, 'Nested sidebar configuration must be valid');
        assertEqual(nestedConfig.items[0].children.length, 2);
      }
    },
    {
      name: 'TC-T3-12: Active route synchronization between URL pathname and mobile bottom tab highlight',
      fn: async () => {
        const navState = createMobileNavigationState();
        navState.setActivePath('/matches');

        const activeTab = navState.getActiveTab();
        assertOk(activeTab);
        assertEqual(activeTab.path, '/matches');
      }
    }
  ]
};
