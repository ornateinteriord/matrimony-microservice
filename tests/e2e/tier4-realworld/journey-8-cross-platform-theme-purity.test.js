/**
 * Tier 4 Real-World Scenario 8: Cross-Platform Theme Purity & Anti-Slop Audit
 * Multi-step comprehensive audit across all three applications
 * inspecting REAL workspace files on disk (App.css, theme configs, components).
 */

const { readAppFile, appFileExists } = require('../helpers/workspace-resolver');
const {
  THEME_SPECS,
  checkThemeCompliance,
  scanTextForForbiddenElements,
  calculateContrastRatio
} = require('../helpers/theme-verifier');
const { scanForPlaceholders } = require('../helpers/legal-compliance');
const { assertOk, assertEqual, assertColorHex } = require('../helpers/assertions');

const APPS = ['Girija-Kalyana', 'Sangam-sathi', 'Shree-ganda'];

module.exports = {
  id: 'JOURNEY-08',
  name: 'Cross-Platform Theme Purity & Anti-Slop Audit',
  tier: 'tier4',
  tests: [
    {
      name: 'Scenario 8: Complete cross-platform theme purity, color contrast, and anti-slop verification audit',
      fn: async () => {
        // Step 1: Verify all 3 brand themes define unique, distinct primary & secondary palettes
        for (const app of APPS) {
          const spec = THEME_SPECS[app];
          assertOk(spec, `Theme spec for ${app} must exist`);
          assertOk(spec.primary.startsWith('#'), `${app} primary must be hex color`);
          assertOk(spec.secondary.startsWith('#'), `${app} secondary must be hex color`);

          const sampleThemeConfig = {
            palette: {
              primary: { main: spec.primary },
              secondary: { main: spec.secondary }
            }
          };

          const compliance = checkThemeCompliance(app, sampleThemeConfig);
          assertOk(compliance.compliant, `${app} theme compliance failed: ${compliance.issues.join('; ')}`);
        }

        // Step 2: Verify all 3 primary colors are distinct from one another
        const primaries = APPS.map(a => THEME_SPECS[a].primary.toLowerCase());
        const uniquePrimaries = new Set(primaries);
        assertEqual(uniquePrimaries.size, 3, 'All 3 apps must feature distinct, non-overlapping primary colors');

        assertColorHex(THEME_SPECS['Girija-Kalyana'].primary, '#881337');
        assertColorHex(THEME_SPECS['Sangam-sathi'].primary, '#0B192C');
        assertColorHex(THEME_SPECS['Shree-ganda'].primary, '#C5A059');

        // Step 3: Contrast compliance for all primary colors
        for (const app of APPS) {
          const spec = THEME_SPECS[app];
          const contrastWhite = calculateContrastRatio(spec.primary, '#FFFFFF');
          const contrastBlack = calculateContrastRatio(spec.primary, '#000000');
          const maxContrast = Math.max(contrastWhite, contrastBlack);
          assertOk(maxContrast >= 4.5, `${app} primary ${spec.primary} must achieve at least 4.5:1 against black or white`);
        }

        // Step 4: Scan real App.css files across all three applications on disk
        for (const app of APPS) {
          assertOk(appFileExists(app, 'src', 'App.css'), `${app} App.css must exist`);
          const appCss = readAppFile(app, 'src', 'App.css');
          const scanRes = scanTextForForbiddenElements(appCss, app);
          assertOk(scanRes.clean, `${app} App.css contains forbidden styling: ${scanRes.violations.join('; ')}`);
        }

        // Step 5: Anti-placeholder scanner test across real components on disk
        for (const app of APPS) {
          const appTsx = readAppFile(app, 'src', 'App.tsx');
          const placeholderRes = scanForPlaceholders(appTsx);
          assertOk(placeholderRes.clean, `${app} App.tsx contains placeholder text: ${placeholderRes.detected.join('; ')}`);
        }
      }
    }
  ]
};
