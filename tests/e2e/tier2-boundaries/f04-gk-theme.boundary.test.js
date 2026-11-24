/**
 * Tier 2 Boundary Test Suite: F4 - Girija-Kalyana Theme Boundaries & Negative Tests
 * Verifies color mismatches, subtle purple variants, radii limits, and emoji sweeps.
 */

const {
  checkThemeCompliance,
  scanTextForForbiddenElements,
  calculateContrastRatio
} = require('../helpers/theme-verifier');
const { assertOk, assertEqual } = require('../helpers/assertions');

module.exports = {
  id: 'F04-BVA',
  name: 'Girija-Kalyana Theme Boundary & Negative Tests',
  tier: 'tier2',
  tests: [
    {
      name: 'TC-F04-B01: Theme compliance validator flags incorrect primary color code',
      fn: async () => {
        const wrongPrimaryTheme = {
          palette: {
            primary: { main: '#7A0C2E' }, // Off-shade
            secondary: { main: '#D97706' }
          }
        };
        const res = checkThemeCompliance('Girija-Kalyana', wrongPrimaryTheme);
        assertEqual(res.compliant, false, 'Non-exact primary color must fail');
        assertOk(res.issues.some(i => i.includes('Primary color mismatch')));
      }
    },
    {
      name: 'TC-F04-B02: Theme compliance validator flags incorrect secondary color code',
      fn: async () => {
        const wrongSecondaryTheme = {
          palette: {
            primary: { main: '#881337' },
            secondary: { main: '#F59E0B' } // Amber instead of Antique Gold #D97706
          }
        };
        const res = checkThemeCompliance('Girija-Kalyana', wrongSecondaryTheme);
        assertEqual(res.compliant, false, 'Non-exact secondary color must fail');
        assertOk(res.issues.some(i => i.includes('Secondary color mismatch')));
      }
    },
    {
      name: 'TC-F04-B03: Scanner detects subtle rgba(106, 27, 154) variants and flags purple presence',
      fn: async () => {
        const rgbaSample = 'border: 2px solid rgba(106, 27, 154, 0.8);';
        const res = scanTextForForbiddenElements(rgbaSample, 'Girija-Kalyana');
        assertEqual(res.clean, false, 'rgba purple variant must be flagged');
      }
    },
    {
      name: 'TC-F04-B04: Scanner detects borderRadius numeric literal of 20 in JSX style objects',
      fn: async () => {
        const jsxStyleSample = '<Card sx={{ borderRadius: 20, bgcolor: "#881337" }}>';
        const res = scanTextForForbiddenElements(jsxStyleSample, 'Girija-Kalyana');
        assertEqual(res.clean, false, 'borderRadius: 20 must be flagged');
      }
    },
    {
      name: 'TC-F04-B05: Contrast evaluation flags low-contrast foreground/background combinations',
      fn: async () => {
        // Low contrast pairing: Gold on light cream fails WCAG AA normal text
        const lowContrast = calculateContrastRatio('#D97706', '#FDF6B2');
        assertOk(lowContrast < 4.5, 'Low contrast pairing must be recognized as failing WCAG AA (>=4.5)');
      }
    }
  ]
};
