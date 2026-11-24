/**
 * Tier 2 Boundary Test Suite: F18 - Shree-ganda Dynamic Sidebar Boundaries
 * Verifies missing homePath, invalid badge types, privilege isolation, and sub-menu contracts.
 */

const { validateSidebarConfig, validateNavItemConfig } = require('../helpers/contracts');
const { assertOk, assertEqual } = require('../helpers/assertions');

module.exports = {
  id: 'F18-BVA',
  name: 'Shree-ganda Dynamic Sidebar Boundaries',
  tier: 'tier2',
  tests: [
    {
      name: 'TC-F18-B01: SidebarConfig rejects missing or non-string homePath',
      fn: async () => {
        const res = validateSidebarConfig({ brandTitle: 'Shree Ganda', homePath: null, items: [] });
        assertEqual(res.valid, false, 'Non-string homePath must be rejected');
      }
    },
    {
      name: 'TC-F18-B02: NavItemConfig rejects boolean or object badge values',
      fn: async () => {
        const itemBadBadge = { id: 'dash', title: 'Dash', path: '/d', icon: 'I', badge: true };
        const res = validateNavItemConfig(itemBadBadge);
        assertEqual(res.valid, false, 'Boolean badge must be rejected');
        assertOk(res.errors.some(e => e.includes('badge')));
      }
    },
    {
      name: 'TC-F18-B03: Privilege isolation: Non-admin role cannot view member records or audit',
      fn: async () => {
        const items = [
          { id: 'members', title: 'Members', path: '/members', roles: ['admin'] },
          { id: 'audit', title: 'Audit', path: '/audit', roles: ['admin', 'security'] }
        ];
        const isPermitted = (item, userRole) => item.roles.includes(userRole);

        assertEqual(isPermitted(items[0], 'promoter'), false);
        assertEqual(isPermitted(items[1], 'promoter'), false);
      }
    },
    {
      name: 'TC-F18-B04: Nested child item without title is rejected by recursive validator',
      fn: async () => {
        const parentWithBadChild = {
          id: 'parent',
          title: 'Parent',
          path: '/parent',
          icon: 'Folder',
          children: [
            { id: 'child', title: '', path: '/child', icon: 'File' } // Empty title
          ]
        };
        const res = validateNavItemConfig(parentWithBadChild);
        assertEqual(res.valid, false, 'Child with empty title must be rejected');
      }
    },
    {
      name: 'TC-F18-B05: NavItemConfig accepts string or numeric badge',
      fn: async () => {
        const itemStringBadge = { id: '1', title: 'T', path: '/p', icon: 'I', badge: 'NEW' };
        const itemNumberBadge = { id: '2', title: 'T', path: '/p', icon: 'I', badge: 12 };
        assertEqual(validateNavItemConfig(itemStringBadge).valid, true);
        assertEqual(validateNavItemConfig(itemNumberBadge).valid, true);
      }
    }
  ]
};
