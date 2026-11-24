/**
 * Tier 1 Test Suite: F2 - Shared Navigation & Sponsor Contracts
 * Verifies contract specifications for:
 * - NavItemConfig
 * - SidebarConfig
 * - SponsorLockState
 * - PageMetadata
 *
 * Inspects real TypeScript contract files on disk across apps/*
 */

const { readAppFile, appFileExists } = require('../helpers/workspace-resolver');
const {
  validateNavItemConfig,
  validateSidebarConfig,
  validateSponsorLockState,
  validatePageMetadata
} = require('../helpers/contracts');
const { assertOk } = require('../helpers/assertions');

const APPS = ['Girija-Kalyana', 'Sangam-sathi', 'Shree-ganda'];

module.exports = {
  id: 'F02',
  name: 'Shared Navigation & Sponsor Contracts',
  tier: 'tier1',
  tests: [
    {
      name: 'TC-F02-01: NavItemConfig interface exists in all workspace applications',
      fn: async () => {
        for (const app of APPS) {
          assertOk(appFileExists(app, 'src', 'types', 'navigation.ts'), `${app} must define src/types/navigation.ts`);
          const content = readAppFile(app, 'src', 'types', 'navigation.ts');
          assertOk(content.includes('export interface NavItemConfig'), `${app} navigation.ts must export NavItemConfig`);
          assertOk(content.includes('id: string'), 'NavItemConfig must declare id field');
          assertOk(content.includes('title: string'), 'NavItemConfig must declare title field');
        }
      }
    },
    {
      name: 'TC-F02-02: SidebarConfig interface exists in all workspace applications',
      fn: async () => {
        for (const app of APPS) {
          const content = readAppFile(app, 'src', 'types', 'navigation.ts');
          assertOk(content.includes('export interface SidebarConfig'), `${app} navigation.ts must export SidebarConfig`);
          assertOk(content.includes('brandTitle: string'), 'SidebarConfig must declare brandTitle field');
          assertOk(content.includes('items: NavItemConfig[]'), 'SidebarConfig must declare items field');
        }
      }
    },
    {
      name: 'TC-F02-03: SponsorLockState interface exists in all workspace applications',
      fn: async () => {
        for (const app of APPS) {
          assertOk(appFileExists(app, 'src', 'types', 'sponsor.ts'), `${app} must define src/types/sponsor.ts`);
          const content = readAppFile(app, 'src', 'types', 'sponsor.ts');
          assertOk(content.includes('export interface SponsorLockState'), `${app} sponsor.ts must export SponsorLockState`);
          assertOk(content.includes('isLocked: boolean'), 'SponsorLockState must declare isLocked');
          assertOk(content.includes('isVerified: boolean'), 'SponsorLockState must declare isVerified');
        }
      }
    },
    {
      name: 'TC-F02-04: PageMetadata interface exists in all workspace applications',
      fn: async () => {
        for (const app of APPS) {
          assertOk(appFileExists(app, 'src', 'types', 'seo.ts'), `${app} must define src/types/seo.ts`);
          const content = readAppFile(app, 'src', 'types', 'seo.ts');
          assertOk(content.includes('export interface PageMetadata'), `${app} seo.ts must export PageMetadata`);
          assertOk(content.includes('title: string'), 'PageMetadata must declare title field');
          assertOk(content.includes('description: string'), 'PageMetadata must declare description field');
        }
      }
    },
    {
      name: 'TC-F02-05: Runtime contract validator approves conforming navigation and lock states',
      fn: async () => {
        const itemRes = validateNavItemConfig({ id: 'home', title: 'Home', path: '/', icon: 'HomeIcon' });
        assertOk(itemRes.valid, 'Conforming NavItemConfig should validate');
        const lockRes = validateSponsorLockState({ code: 'PROMO99', promoterName: 'Suresh', isLocked: true, isVerified: true, isAutoPopulated: true, error: null });
        assertOk(lockRes.valid, 'Conforming SponsorLockState should validate');
        const metaRes = validatePageMetadata({ title: 'Girija Kalyana', description: 'Matrimony portal', canonicalUrl: 'https://girijakalyana.com' });
        assertOk(metaRes.valid, 'Conforming PageMetadata should validate');
      }
    }
  ]
};
