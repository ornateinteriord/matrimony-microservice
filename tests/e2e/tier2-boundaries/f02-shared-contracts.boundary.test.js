/**
 * Tier 2 Boundary Test Suite: F2 - Shared Navigation & Sponsor Contracts Boundaries
 * Verifies validation boundaries, deep recursion limits, and contract schema violations.
 */

const {
  validateNavItemConfig,
  validateSidebarConfig,
  validateSponsorLockState,
  validatePageMetadata
} = require('../helpers/contracts');
const { assertOk, assertEqual } = require('../helpers/assertions');

module.exports = {
  id: 'F02-BVA',
  name: 'Shared Contracts Boundary & Negative Tests',
  tier: 'tier2',
  tests: [
    {
      name: 'TC-F02-B01: NavItemConfig validator rejects missing or whitespace-only id',
      fn: async () => {
        const itemEmptyId = { id: '   ', title: 'Home', path: '/', icon: 'Home' };
        const res = validateNavItemConfig(itemEmptyId);
        assertEqual(res.valid, false, 'Whitespace-only id must be rejected');
        assertOk(res.errors.some(e => e.includes('id')), 'Must report id error');
      }
    },
    {
      name: 'TC-F02-B02: Deep recursion guard prevents stack overflow on circular/excessive nesting',
      fn: async () => {
        let root = { id: 'lvl0', title: 'L0', path: '/0', icon: 'Icon', children: [] };
        let curr = root;
        for (let i = 1; i <= 15; i++) {
          const next = { id: `lvl${i}`, title: `L${i}`, path: `/${i}`, icon: 'Icon', children: [] };
          curr.children.push(next);
          curr = next;
        }

        const res = validateNavItemConfig(root);
        assertEqual(res.valid, false, 'Nesting depth > 10 must be flagged');
        assertOk(res.errors.some(e => e.includes('depth')), 'Must report recursion depth error');
      }
    },
    {
      name: 'TC-F02-B03: SidebarConfig rejects null, empty brandTitle, and non-array items',
      fn: async () => {
        assertEqual(validateSidebarConfig(null).valid, false);
        assertEqual(validateSidebarConfig({ brandTitle: '', items: [] }).valid, false);
        assertEqual(validateSidebarConfig({ brandTitle: 'Valid', items: 'not-an-array' }).valid, false);
      }
    },
    {
      name: 'TC-F02-B04: SponsorLockState rejects string type for boolean lock flags',
      fn: async () => {
        const invalidLockState = {
          code: 'PROMO99',
          promoterName: 'Test',
          isLocked: 'true', // Should be boolean true, not string
          isVerified: true,
          isAutoPopulated: false,
          error: null
        };
        const res = validateSponsorLockState(invalidLockState);
        assertEqual(res.valid, false, 'Non-boolean isLocked must be rejected');
      }
    },
    {
      name: 'TC-F02-B05: PageMetadata rejects relative URL in canonicalUrl',
      fn: async () => {
        const invalidMeta = {
          title: 'Test Title',
          description: 'Test Description',
          canonicalUrl: '/relative/path/not-allowed'
        };
        const res = validatePageMetadata(invalidMeta);
        assertEqual(res.valid, false, 'Relative canonicalUrl must be rejected');
        assertOk(res.errors.some(e => e.includes('absolute')), 'Must enforce absolute URL');
      }
    }
  ]
};
