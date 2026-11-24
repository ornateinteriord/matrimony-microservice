/**
 * Tier 1 Test Suite: F16 - Shree-ganda Heritage Sandalwood Theme
 * Inspects real workspace files on disk: theme config, App.css, Navbar.tsx, and Footer.tsx
 * for Sandalwood Gold (#C5A059) and Deep Sindoor Red (#8B1E1E), WCAG AA contrast, and anti-slop rules.
 */

const { readAppFile, appFileExists } = require('../helpers/workspace-resolver');
const {
  THEME_SPECS,
  calculateContrastRatio,
  scanTextForForbiddenElements
} = require('../helpers/theme-verifier');
const { assertOk } = require('../helpers/assertions');

module.exports = {
  id: 'F16',
  name: 'Shree-ganda Heritage Sandalwood Theme',
  tier: 'tier1',
  tests: [
    {
      name: 'TC-F16-01: Theme configuration file exists on disk and exports Sandalwood Gold and Deep Sindoor Red',
      fn: async () => {
        const hasTheme = appFileExists('Shree-ganda', 'src', 'theme.ts') || appFileExists('Shree-ganda', 'src', 'theme', 'theme.ts');
        assertOk(hasTheme, 'Theme configuration file must exist in Shree-ganda');
        const themeContent = appFileExists('Shree-ganda', 'src', 'theme.ts')
          ? readAppFile('Shree-ganda', 'src', 'theme.ts')
          : readAppFile('Shree-ganda', 'src', 'theme', 'theme.ts');
        assertOk(themeContent.toLowerCase().includes('#c5a059'), 'Theme must declare Sandalwood Gold #C5A059');
        assertOk(themeContent.toLowerCase().includes('#8b1e1e'), 'Theme must declare Deep Sindoor Red #8B1E1E');
      }
    },
    {
      name: 'TC-F16-02: Deep Sindoor Red #8B1E1E contrast against white meets WCAG AA standard (>= 4.5:1)',
      fn: async () => {
        const secondaryContrast = calculateContrastRatio('#8B1E1E', '#FFFFFF');
        assertOk(
          secondaryContrast >= 4.5,
          `Secondary color #8B1E1E contrast against white (${secondaryContrast.toFixed(2)}) must meet WCAG AA (>= 4.5)`
        );
      }
    },
    {
      name: 'TC-F16-03: Real CSS source files in Shree-ganda contain zero legacy purple or pill buttons',
      fn: async () => {
        const appCss = readAppFile('Shree-ganda', 'src', 'App.css');
        const scan = scanTextForForbiddenElements(appCss, 'Shree-ganda');
        assertOk(scan.clean, `App.css contains forbidden styling: ${scan.violations.join('; ')}`);
      }
    },
    {
      name: 'TC-F16-04: Navbar component source file contains zero forbidden purple, pill buttons, or emojis',
      fn: async () => {
        const navbar = readAppFile('Shree-ganda', 'src', 'components', 'navbar', 'Navbar.tsx');
        const scan = scanTextForForbiddenElements(navbar, 'Shree-ganda');
        assertOk(scan.clean, `Navbar.tsx contains forbidden emoji/styling: ${scan.violations.join('; ')}`);
      }
    },
    {
      name: 'TC-F16-05: Footer component source file contains zero pill buttons or emojis',
      fn: async () => {
        const footer = readAppFile('Shree-ganda', 'src', 'components', 'footer', 'Footer.tsx');
        const scan = scanTextForForbiddenElements(footer, 'Shree-ganda');
        assertOk(scan.clean, `Footer.tsx contains forbidden styling: ${scan.violations.join('; ')}`);
      }
    }
  ]
};
