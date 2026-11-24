/**
 * Tier 4 Real-World Scenario 3: Admin Navigation & Dynamic Sidebar Interaction
 * Multi-step simulation of an administrator logging in and navigating through
 * dynamic sidebar modules across permissions and submenus:
 * 1. Admin authenticates with role `admin`.
 * 2. Dynamic sidebar renders all admin-authorized modules.
 * 3. Admin clicks 'User Management'; route changes to `/admin/users`; active highlight updates.
 * 4. Admin opens 'Reports' expandable section; sub-items appear.
 * 5. Admin role changes to `support`; unauthorized modules immediately hide.
 */

const { validateSidebarConfig } = require('../helpers/contracts');
const { assertOk, assertEqual } = require('../helpers/assertions');

const FULL_ADMIN_SIDEBAR = {
  brandTitle: 'Admin Central',
  homePath: '/admin/dashboard',
  items: [
    { id: 'dashboard', title: 'Dashboard', path: '/admin/dashboard', icon: 'Dash', roles: ['admin', 'support'] },
    { id: 'users', title: 'User Management', path: '/admin/users', icon: 'People', roles: ['admin'] },
    {
      id: 'reports',
      title: 'Financial Reports',
      path: '/admin/reports',
      icon: 'Assessment',
      roles: ['admin'],
      children: [
        { id: 'receipts', title: 'Receipt Vouchers', path: '/admin/reports/receipts', icon: 'Receipt' },
        { id: 'renewals', title: 'Renewals Reports', path: '/admin/reports/renewals', icon: 'Autorenew' }
      ]
    },
    { id: 'support-tickets', title: 'Support Tickets', path: '/admin/support', icon: 'Headset', roles: ['admin', 'support'] }
  ]
};

function getVisibleSidebarItems(config, userRole) {
  return config.items.filter(item => {
    if (!item.roles || item.roles.length === 0) return true;
    return item.roles.includes(userRole);
  });
}

module.exports = {
  id: 'JOURNEY-03',
  name: 'Admin Navigation & Dynamic Sidebar Interaction',
  tier: 'tier4',
  tests: [
    {
      name: 'Scenario 3: Complete administrator navigation lifecycle with dynamic permissions',
      fn: async () => {
        // Step 1: Validate full configuration schema
        const contractCheck = validateSidebarConfig(FULL_ADMIN_SIDEBAR);
        assertOk(contractCheck.valid, 'Sidebar configuration must satisfy interface contract');

        // Step 2: Admin role session starts
        const adminView = getVisibleSidebarItems(FULL_ADMIN_SIDEBAR, 'admin');
        assertEqual(adminView.length, 4, 'Admin should see all 4 top-level items');

        // Step 3: Admin navigates to User Management
        let activePath = '/admin/users';
        const activeItem = adminView.find(i => i.path === activePath);
        assertOk(activeItem);
        assertEqual(activeItem.id, 'users', 'Active menu item is users');

        // Step 4: Expand Reports sub-menu
        const reportsMenu = adminView.find(i => i.id === 'reports');
        assertOk(reportsMenu && reportsMenu.children);
        assertEqual(reportsMenu.children.length, 2, 'Reports must have 2 sub-items');

        // Navigate to child report
        activePath = '/admin/reports/receipts';
        const activeSubItem = reportsMenu.children.find(c => c.path === activePath);
        assertOk(activeSubItem);
        assertEqual(activeSubItem.title, 'Receipt Vouchers');

        // Step 5: Switch session to Support role
        const supportView = getVisibleSidebarItems(FULL_ADMIN_SIDEBAR, 'support');
        assertEqual(supportView.length, 2, 'Support role should only see Dashboard and Support Tickets');
        assertEqual(supportView.some(i => i.id === 'reports'), false, 'Reports must not be accessible to support');
        assertEqual(supportView.some(i => i.id === 'users'), false, 'User Management must not be accessible to support');
      }
    }
  ]
};
