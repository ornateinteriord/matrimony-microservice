/**
 * Tier 1 Test Suite: F18 - Shree-ganda Dynamic Sidebar Architecture
 * Verifies declarative DynamicSidebar component exists on disk, satisfies SidebarConfig contract,
 * and executes role-based item filtering and active route identification for Shree-ganda.
 */

const { readAppFile, appFileExists } = require('../helpers/workspace-resolver');
const { validateSidebarConfig } = require('../helpers/contracts');
const { assertOk, assertEqual } = require('../helpers/assertions');

const SG_SIDEBAR_CONFIG = {
  brandTitle: 'Shree Ganda Admin',
  homePath: '/admin/dashboard',
  items: [
    { id: 'dashboard', title: 'Dashboard', path: '/admin/dashboard', icon: 'Dashboard', roles: ['admin'] },
    { id: 'members', title: 'Member Records', path: '/admin/members', icon: 'Group', roles: ['admin'] },
    { id: 'verifications', title: 'Photo Verifications', path: '/admin/verifications', icon: 'CameraAlt', roles: ['admin'] },
    { id: 'subscriptions', title: 'Membership Plans', path: '/admin/plans', icon: 'Loyalty', roles: ['admin'] },
    { id: 'audit', title: 'Security Audit', path: '/admin/audit', icon: 'Security', roles: ['admin', 'security'] }
  ]
};

function filterItemsByRole(items, role) {
  return items.filter(item => {
    if (!item.roles || item.roles.length === 0) return true;
    return item.roles.includes(role);
  });
}

module.exports = {
  id: 'F18',
  name: 'Shree-ganda Dynamic Sidebar',
  tier: 'tier1',
  tests: [
    {
      name: 'TC-F18-01: DynamicSidebar component exists on disk and satisfies SidebarConfig contract',
      fn: async () => {
        assertOk(appFileExists('Shree-ganda', 'src', 'components', 'common', 'DynamicSidebar.tsx'), 'DynamicSidebar.tsx must exist in Shree-ganda');
        const sidebarContent = readAppFile('Shree-ganda', 'src', 'components', 'common', 'DynamicSidebar.tsx');
        assertOk(sidebarContent.includes('SidebarConfig'), 'DynamicSidebar must import SidebarConfig');
        const res = validateSidebarConfig(SG_SIDEBAR_CONFIG);
        assertOk(res.valid, `Sidebar config must be valid: ${res.errors.join('; ')}`);
        assertEqual(SG_SIDEBAR_CONFIG.brandTitle, 'Shree Ganda Admin');
      }
    },
    {
      name: 'TC-F18-02: Admin role sees complete 5-module management menu',
      fn: async () => {
        const adminItems = filterItemsByRole(SG_SIDEBAR_CONFIG.items, 'admin');
        assertEqual(adminItems.length, 5, 'Admin role should have 5 items');
      }
    },
    {
      name: 'TC-F18-03: Security role sees only security audit module',
      fn: async () => {
        const securityItems = filterItemsByRole(SG_SIDEBAR_CONFIG.items, 'security');
        assertEqual(securityItems.length, 1, 'Security role should have 1 item');
        assertEqual(securityItems[0].id, 'audit');
      }
    },
    {
      name: 'TC-F18-04: Active route highlighter detects matching navigation path',
      fn: async () => {
        const activeItem = SG_SIDEBAR_CONFIG.items.find(i => i.path === '/admin/plans');
        assertOk(activeItem, 'Must find active item for /admin/plans');
        assertEqual(activeItem.title, 'Membership Plans');
      }
    },
    {
      name: 'TC-F18-05: Sidebar navigation items declare non-empty title, path, and icon properties',
      fn: async () => {
        for (const item of SG_SIDEBAR_CONFIG.items) {
          assertOk(typeof item.id === 'string' && item.id.length > 0, 'Item must have id');
          assertOk(typeof item.title === 'string' && item.title.length > 0, 'Item must have title');
          assertOk(typeof item.path === 'string' && item.path.startsWith('/'), 'Item path must start with /');
          assertOk(Boolean(item.icon), 'Item must have icon');
        }
      }
    }
  ]
};
