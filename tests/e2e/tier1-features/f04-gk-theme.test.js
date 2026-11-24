/**
 * Tier 1 Test Suite: F4 - Girija-Kalyana Modern Vedic Theme
 * Inspects real workspace files on disk: theme config, App.css, Navbar.tsx, and Footer.tsx
 * for Sacred Rosewood (#881337) and Antique Gold (#D97706), WCAG AA contrast, and anti-slop rules.
 */

const { readAppFile, appFileExists } = require('../helpers/workspace-resolver');
const {
  THEME_SPECS,
  calculateContrastRatio,
  scanTextForForbiddenElements
} = require('../helpers/theme-verifier');
const { assertOk } = require('../helpers/assertions');

module.exports = {
  id: 'F04',
  name: 'Girija-Kalyana Modern Vedic Theme',
  tier: 'tier1',
  tests: [
    {
      name: 'TC-F04-01: Theme configuration file exists on disk and exports Sacred Rosewood and Gold',
      fn: async () => {
        assertOk(appFileExists('Girija-Kalyana', 'src', 'theme', 'theme.ts'), 'apps/Girija-Kalyana/src/theme/theme.ts must exist');
        const themeContent = readAppFile('Girija-Kalyana', 'src', 'theme', 'theme.ts');
        assertOk(themeContent.toLowerCase().includes('#881337'), 'Theme must declare Sacred Rosewood #881337');
        assertOk(themeContent.toLowerCase().includes('#d97706'), 'Theme must declare Antique Gold #D97706');
      }
    },
    {
      name: 'TC-F04-02: Theme contrast ratio on light background meets WCAG AA standard (>= 4.5:1)',
      fn: async () => {
        const primaryContrast = calculateContrastRatio('#881337', '#FFFFFF');
        assertOk(
          primaryContrast >= 4.5,
          `Primary color #881337 contrast against white (${primaryContrast.toFixed(2)}) must meet WCAG AA (>= 4.5)`
        );
      }
    },
    {
      name: 'TC-F04-03: Real CSS source files in Girija-Kalyana contain zero legacy #6a1b9a purple or pill buttons',
      fn: async () => {
        const appCss = readAppFile('Girija-Kalyana', 'src', 'App.css');
        const scan = scanTextForForbiddenElements(appCss, 'Girija-Kalyana');
        assertOk(scan.clean, `App.css contains forbidden styling: ${scan.violations.join('; ')}`);
      }
    },
    {
      name: 'TC-F04-04: Navbar component source file contains zero legacy purple, pill buttons, or emojis',
      fn: async () => {
        const navbar = readAppFile('Girija-Kalyana', 'src', 'components', 'navbar', 'Navbar.tsx');
        const scan = scanTextForForbiddenElements(navbar, 'Girija-Kalyana');
        assertOk(scan.clean, `Navbar.tsx contains forbidden emoji/styling: ${scan.violations.join('; ')}`);
      }
    },
    {
      name: 'TC-F04-05: Footer component source file contains zero pill buttons or emojis',
      fn: async () => {
        const footer = readAppFile('Girija-Kalyana', 'src', 'components', 'footer', 'Footer.tsx');
        const scan = scanTextForForbiddenElements(footer, 'Girija-Kalyana');
        assertOk(scan.clean, `Footer.tsx contains forbidden styling: ${scan.violations.join('; ')}`);
      }
    }
  ]
};
