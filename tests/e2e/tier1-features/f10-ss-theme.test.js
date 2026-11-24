/**
 * Tier 1 Test Suite: F10 - Sangam-sathi Royal Modern Theme
 * Inspects real workspace files on disk: theme config, App.css, Navbar.tsx, and Footer.tsx
 * for Midnight Imperial Navy (#0B192C) and Champagne Gold (#D4AF37), WCAG AA contrast, and anti-slop rules.
 */

const { readAppFile, appFileExists } = require('../helpers/workspace-resolver');
const {
  THEME_SPECS,
  calculateContrastRatio,
  scanTextForForbiddenElements
} = require('../helpers/theme-verifier');
const { assertOk } = require('../helpers/assertions');

module.exports = {
  id: 'F10',
  name: 'Sangam-sathi Royal Modern Theme',
  tier: 'tier1',
  tests: [
    {
      name: 'TC-F10-01: Theme configuration file exists on disk and exports Midnight Navy and Champagne Gold',
      fn: async () => {
        assertOk(appFileExists('Sangam-sathi', 'src', 'theme', 'theme.ts'), 'apps/Sangam-sathi/src/theme/theme.ts must exist');
        const themeContent = readAppFile('Sangam-sathi', 'src', 'theme', 'theme.ts');
        assertOk(themeContent.toLowerCase().includes('#0b192c'), 'Theme must declare Midnight Navy #0B192C');
        assertOk(themeContent.toLowerCase().includes('#d4af37'), 'Theme must declare Champagne Gold #D4AF37');
      }
    },
    {
      name: 'TC-F10-02: Midnight Navy #0B192C contrast against white meets WCAG AA standard (>= 4.5:1)',
      fn: async () => {
        const primaryContrast = calculateContrastRatio('#0B192C', '#FFFFFF');
        assertOk(
          primaryContrast >= 4.5,
          `Primary color #0B192C contrast against white (${primaryContrast.toFixed(2)}) must meet WCAG AA (>= 4.5)`
        );
      }
    },
    {
      name: 'TC-F10-03: Real CSS source files in Sangam-sathi contain zero legacy purple or pill buttons',
      fn: async () => {
        const appCss = readAppFile('Sangam-sathi', 'src', 'App.css');
        const scan = scanTextForForbiddenElements(appCss, 'Sangam-sathi');
        assertOk(scan.clean, `App.css contains forbidden styling: ${scan.violations.join('; ')}`);
      }
    },
    {
      name: 'TC-F10-04: Navbar component source file contains zero forbidden purple, pill buttons, or emojis',
      fn: async () => {
        const navbar = readAppFile('Sangam-sathi', 'src', 'components', 'navbar', 'Navbar.tsx');
        const scan = scanTextForForbiddenElements(navbar, 'Sangam-sathi');
        assertOk(scan.clean, `Navbar.tsx contains forbidden emoji/styling: ${scan.violations.join('; ')}`);
      }
    },
    {
      name: 'TC-F10-05: Footer component source file contains zero pill buttons or emojis',
      fn: async () => {
        const footer = readAppFile('Sangam-sathi', 'src', 'components', 'footer', 'Footer.tsx');
        const scan = scanTextForForbiddenElements(footer, 'Sangam-sathi');
        assertOk(scan.clean, `Footer.tsx contains forbidden styling: ${scan.violations.join('; ')}`);
      }
    }
  ]
};
