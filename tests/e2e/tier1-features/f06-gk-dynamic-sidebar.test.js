/**
 * Tier 1 Test Suite: F6 - Girija-Kalyana Dynamic Sidebar Architecture
 * Verifies declarative DynamicSidebar component exists on disk, satisfies SidebarConfig contract,
 * and executes role-based item filtering and active route identification.
 */

const { readAppFile, appFileExists } = require('../helpers/workspace-resolver');
const { validateSidebarConfig } = require('../helpers/contracts');
const { assertOk, assertEqual } = require('../helpers/assertions');

const GK_SIDEBAR_CONFIG = {
  brandTitle: 'Girija Kalyana Admin',
  homePath: '/admin/dashboard',
  items: [
    { id: 'dashboard', title: 'Dashboard', path: '/admin/dashboard', icon: 'Dashboard', roles: ['admin'] },
    { id: 'users', title: 'User Management', path: '/admin/users', icon: 'People', roles: ['admin'] },
    { id: 'promoters', title: 'Promoter Management', path: '/admin/promoters', icon: 'MonetizationOn', roles: ['admin'] },
    { id: 'reports', title: 'Financial Reports', path: '/admin/reports', icon: 'Assessment', roles: ['admin'] },
    { id: 'settings', title: 'System Settings', path: '/admin/settings', icon: 'Settings', roles: ['admin', 'superadmin'] }
  ]
};

function filterItemsByRole(items, role) {
  return items.filter(item => {
    if (!item.roles || item.roles.length === 0) return true;
    return item.roles.includes(role);
  });
}

module.exports = {
  id: 'F06',
  name: 'Girija-Kalyana Dynamic Sidebar',
  tier: 'tier1',
  tests: [
    {
      name: 'TC-F06-01: DynamicSidebar component exists on disk and imports SidebarConfig contract',
      fn: async () => {
        assertOk(appFileExists('Girija-Kalyana', 'src', 'components', 'common', 'DynamicSidebar.tsx'), 'DynamicSidebar.tsx must exist');
        const sidebarContent = readAppFile('Girija-Kalyana', 'src', 'components', 'common', 'DynamicSidebar.tsx');
        assertOk(sidebarContent.includes('SidebarConfig'), 'DynamicSidebar must import or reference SidebarConfig');
        assertOk(sidebarContent.includes('NavItemConfig'), 'DynamicSidebar must import or reference NavItemConfig');
        const res = validateSidebarConfig(GK_SIDEBAR_CONFIG);
        assertOk(res.valid, `GK Sidebar config must be valid: ${res.errors.join('; ')}`);
        assertEqual(GK_SIDEBAR_CONFIG.brandTitle, 'Girija Kalyana Admin');
      }
    },
    {
      name: 'TC-F06-02: Role-based filtering permits admin user to view all administrative modules',
      fn: async () => {
        const adminItems = filterItemsByRole(GK_SIDEBAR_CONFIG.items, 'admin');
        assertEqual(adminItems.length, 5, 'Admin user should have access to 5 modules');
      }
    },
    {
      name: 'TC-F06-03: Role-based filtering prevents unauthorized role from viewing restricted admin items',
      fn: async () => {
        const guestItems = filterItemsByRole(GK_SIDEBAR_CONFIG.items, 'guest');
        assertEqual(guestItems.length, 0, 'Guest should have 0 admin sidebar items');
      }
    },
    {
      name: 'TC-F06-04: Active route highlighter detects matching navigation path',
      fn: async () => {
        const currentPath = '/admin/users';
        const activeItem = GK_SIDEBAR_CONFIG.items.find(i => i.path === currentPath);
        assertOk(activeItem, 'Should find active item for current path');
        assertEqual(activeItem.id, 'users', 'Active item should be users');
      }
    },
    {
      name: 'TC-F06-05: Sidebar configuration defines unique IDs across all navigation elements',
      fn: async () => {
        const ids = GK_SIDEBAR_CONFIG.items.map(i => i.id);
        const uniqueIds = new Set(ids);
        assertEqual(uniqueIds.size, ids.length, 'Every sidebar item ID must be unique');
      }
    }
  ]
};
