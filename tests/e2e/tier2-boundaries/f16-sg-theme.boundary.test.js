/**
 * Tier 2 Boundary Test Suite: F16 - Shree-ganda Theme Boundaries
 * Verifies color mismatches, purple shades #9c27b0/#4a148c, pill buttons, and emoji icons.
 */

const {
  checkThemeCompliance,
  scanTextForForbiddenElements,
  calculateContrastRatio
} = require('../helpers/theme-verifier');
const { assertOk, assertEqual } = require('../helpers/assertions');

module.exports = {
  id: 'F16-BVA',
  name: 'Shree-ganda Theme Boundary & Negative Tests',
  tier: 'tier2',
  tests: [
    {
      name: 'TC-F16-B01: Validator rejects bright gold #FFD700 in place of Sandalwood Gold #C5A059',
      fn: async () => {
        const theme = {
          palette: {
            primary: { main: '#FFD700' },
            secondary: { main: '#8B1E1E' }
          }
        };
        const res = checkThemeCompliance('Shree-ganda', theme);
        assertEqual(res.compliant, false, 'Bright gold must be rejected');
        assertOk(res.issues.some(i => i.includes('Primary color mismatch')));
      }
    },
    {
      name: 'TC-F16-B02: Validator rejects bright crimson in place of Deep Sindoor Red #8B1E1E',
      fn: async () => {
        const theme = {
          palette: {
            primary: { main: '#C5A059' },
            secondary: { main: '#DC2626' }
          }
        };
        const res = checkThemeCompliance('Shree-ganda', theme);
        assertEqual(res.compliant, false, 'Crimson red must be rejected');
        assertOk(res.issues.some(i => i.includes('Secondary color mismatch')));
      }
    },
    {
      name: 'TC-F16-B03: Scanner detects #9c27b0 and #4a148c purple palette remnants',
      fn: async () => {
        const legacyCode = 'color: #9c27b0; border: 1px solid #4a148c;';
        const res = scanTextForForbiddenElements(legacyCode, 'Shree-ganda');
        assertEqual(res.clean, false, 'Legacy purple shades must be flagged');
      }
    },
    {
      name: 'TC-F16-B04: Scanner rejects 50px and 9999px pill button border radii',
      fn: async () => {
        const pillStyles = ['border-radius: 50px;', 'border-radius: 9999px;'];
        for (const style of pillStyles) {
          const res = scanTextForForbiddenElements(style, 'Shree-ganda');
          assertEqual(res.clean, false, `Pill radius "${style}" must be flagged`);
        }
      }
    },
    {
      name: 'TC-F16-B05: Contrast evaluation flags low-contrast pairings for Sandalwood Gold',
      fn: async () => {
        // Sandalwood Gold #C5A059 on White fails WCAG AA normal text
        const contrast = calculateContrastRatio('#C5A059', '#FFFFFF');
        assertOk(contrast < 4.5, 'Sandalwood Gold on White fails normal text WCAG AA (<4.5)');
      }
    }
  ]
};
