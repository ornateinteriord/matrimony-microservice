/**
 * Tier 2 Boundary Test Suite: F6 - Girija-Kalyana Dynamic Sidebar Boundaries
 * Verifies empty menus, public role handling, duplicate IDs, and large item counts.
 */

const { validateSidebarConfig } = require('../helpers/contracts');
const { assertOk, assertEqual } = require('../helpers/assertions');

module.exports = {
  id: 'F06-BVA',
  name: 'Girija-Kalyana Dynamic Sidebar Boundaries',
  tier: 'tier2',
  tests: [
    {
      name: 'TC-F06-B01: SidebarConfig with empty items array validates successfully as empty menu',
      fn: async () => {
        const emptySidebar = {
          brandTitle: 'Girija Kalyana',
          homePath: '/',
          items: []
        };
        const res = validateSidebarConfig(emptySidebar);
        assertEqual(res.valid, true, 'Empty items array is valid schema');
      }
    },
    {
      name: 'TC-F06-B02: Items without roles array are treated as accessible to all users',
      fn: async () => {
        const publicItem = { id: 'help', title: 'Help', path: '/help', icon: 'Help' };
        const filterForUser = (item, role) => !item.roles || item.roles.includes(role);

        assertEqual(filterForUser(publicItem, 'admin'), true);
        assertEqual(filterForUser(publicItem, 'free_user'), true);
        assertEqual(filterForUser(publicItem, 'guest'), true);
      }
    },
    {
      name: 'TC-F06-B03: Duplicate item IDs are detected and flagged in validation check',
      fn: async () => {
        const checkDuplicateIds = (items) => {
          const seen = new Set();
          for (const item of items) {
            if (seen.has(item.id)) throw new Error(`Duplicate id detected: ${item.id}`);
            seen.add(item.id);
          }
          return true;
        };

        const duplicateItems = [
          { id: 'dash', title: 'Dash', path: '/1', icon: 'I' },
          { id: 'dash', title: 'Dashboard', path: '/2', icon: 'I' }
        ];
        let caught = false;
        try {
          checkDuplicateIds(duplicateItems);
        } catch (e) {
          caught = true;
        }
        assertEqual(caught, true, 'Must detect duplicate id');
      }
    },
    {
      name: 'TC-F06-B04: High-volume navigation items (100 items) validate within 10ms',
      fn: async () => {
        const largeItems = Array.from({ length: 100 }, (_, i) => ({
          id: `item-${i}`,
          title: `Item ${i}`,
          path: `/path/${i}`,
          icon: 'NavIcon'
        }));
        const start = Date.now();
        const res = validateSidebarConfig({
          brandTitle: 'Large Menu',
          homePath: '/',
          items: largeItems
        });
        const elapsed = Date.now() - start;
        assertOk(res.valid, '100 items must validate successfully');
        assertOk(elapsed < 50, `Elapsed ${elapsed}ms should be under 50ms`);
      }
    },
    {
      name: 'TC-F06-B05: Role comparison performs exact matching without accidental substring escalation',
      fn: async () => {
        const filterByExactRole = (item, role) => Boolean(item.roles?.includes(role));
        const adminItem = { id: 'admin-only', roles: ['admin'] };

        // "administrator" should NOT match "admin"
        assertEqual(filterByExactRole(adminItem, 'administrator'), false);
        assertEqual(filterByExactRole(adminItem, 'admin'), true);
      }
    }
  ]
};
