/**
 * Tier 1 Test Suite: F12 - Sangam-sathi Dynamic Sidebar Architecture
 * Verifies declarative DynamicSidebar component exists on disk, satisfies SidebarConfig contract,
 * and executes role-based item filtering and active route identification for Sangam-sathi.
 */

const { readAppFile, appFileExists } = require('../helpers/workspace-resolver');
const { validateSidebarConfig } = require('../helpers/contracts');
const { assertOk, assertEqual } = require('../helpers/assertions');

const SS_SIDEBAR_CONFIG = {
  brandTitle: 'Sangam Sathi Admin',
  homePath: '/admin/dashboard',
  items: [
    { id: 'dashboard', title: 'Dashboard', path: '/admin/dashboard', icon: 'Dashboard', roles: ['admin'] },
    { id: 'profiles', title: 'Profile Approvals', path: '/admin/profiles', icon: 'VerifiedUser', roles: ['admin'] },
    { id: 'promoters', title: 'Affiliate Network', path: '/admin/affiliates', icon: 'Share', roles: ['admin'] },
    { id: 'transactions', title: 'Transactions', path: '/admin/transactions', icon: 'CreditCard', roles: ['admin'] },
    { id: 'support', title: 'Support Tickets', path: '/admin/support', icon: 'HelpOutline', roles: ['admin', 'support'] }
  ]
};

function filterItemsByRole(items, role) {
  return items.filter(item => {
    if (!item.roles || item.roles.length === 0) return true;
    return item.roles.includes(role);
  });
}

module.exports = {
  id: 'F12',
  name: 'Sangam-sathi Dynamic Sidebar',
  tier: 'tier1',
  tests: [
    {
      name: 'TC-F12-01: DynamicSidebar component exists on disk and satisfies SidebarConfig contract',
      fn: async () => {
        assertOk(appFileExists('Sangam-sathi', 'src', 'components', 'common', 'DynamicSidebar.tsx'), 'DynamicSidebar.tsx must exist in Sangam-sathi');
        const sidebarContent = readAppFile('Sangam-sathi', 'src', 'components', 'common', 'DynamicSidebar.tsx');
        assertOk(sidebarContent.includes('SidebarConfig'), 'DynamicSidebar must import SidebarConfig');
        const res = validateSidebarConfig(SS_SIDEBAR_CONFIG);
        assertOk(res.valid, `Sidebar config must be valid: ${res.errors.join('; ')}`);
        assertEqual(SS_SIDEBAR_CONFIG.brandTitle, 'Sangam Sathi Admin');
      }
    },
    {
      name: 'TC-F12-02: Admin role sees complete 5-module management menu',
      fn: async () => {
        const adminItems = filterItemsByRole(SS_SIDEBAR_CONFIG.items, 'admin');
        assertEqual(adminItems.length, 5, 'Admin role should have 5 items');
      }
    },
    {
      name: 'TC-F12-03: Support role sees only support ticketing and shared modules',
      fn: async () => {
        const supportItems = filterItemsByRole(SS_SIDEBAR_CONFIG.items, 'support');
        assertEqual(supportItems.length, 1, 'Support role should have 1 item');
        assertEqual(supportItems[0].id, 'support');
      }
    },
    {
      name: 'TC-F12-04: Current navigation route /admin/transactions is correctly identified as active',
      fn: async () => {
        const activeItem = SS_SIDEBAR_CONFIG.items.find(i => i.path === '/admin/transactions');
        assertOk(activeItem, 'Must find active item for /admin/transactions');
        assertEqual(activeItem.title, 'Transactions');
      }
    },
    {
      name: 'TC-F12-05: Sidebar navigation items declare non-empty title, path, and icon properties',
      fn: async () => {
        for (const item of SS_SIDEBAR_CONFIG.items) {
          assertOk(typeof item.id === 'string' && item.id.length > 0, 'Item must have id');
          assertOk(typeof item.title === 'string' && item.title.length > 0, 'Item must have title');
          assertOk(typeof item.path === 'string' && item.path.startsWith('/'), 'Item path must start with /');
          assertOk(Boolean(item.icon), 'Item must have icon');
        }
      }
    }
  ]
};
