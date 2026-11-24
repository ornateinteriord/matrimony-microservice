/**
 * Theme and visual anti-slop verifier for:
 * 1. Girija-Kalyana (Rosewood #881337 & Antique Gold #D97706)
 * 2. Sangam-sathi (Midnight Navy #0B192C & Champagne Gold #D4AF37)
 * 3. Shree-ganda (Sandalwood Gold #C5A059 & Deep Sindoor Red #8B1E1E)
 *
 * Verifies color codes, contrast ratios, and purges of purple gradients, pill buttons, and emojis.
 */

const THEME_SPECS = {
  'Girija-Kalyana': {
    primary: '#881337',
    secondary: '#D97706',
    brandName: 'Girija Kalyana',
    forbiddenColors: [
      '#6a1b9a',
      'rgba(106, 27, 154', 'rgba(106,27,154)',
      'rgb(106, 27, 154)', 'rgb(106,27,154)', 'rgb(106, 27, 154', 'rgb(106,27,154'
    ],
    forbiddenColorRegexes: [
      /#6a1b9a/i,
      /rgba?\s*\(\s*106\s*,\s*27\s*,\s*154/i
    ],
    maxAllowedRadius: 16
  },
  'Sangam-sathi': {
    primary: '#0B192C',
    secondary: '#D4AF37',
    brandName: 'Sangam Sathi',
    forbiddenColors: [
      '#5e0476',
      'rgba(94,4,118', 'rgba(94, 4, 118',
      'rgb(94,4,118)', 'rgb(94, 4, 118)', 'rgb(94,4,118', 'rgb(94, 4, 118'
    ],
    forbiddenColorRegexes: [
      /#5e0476/i,
      /rgba?\s*\(\s*94\s*,\s*4\s*,\s*118/i
    ],
    maxAllowedRadius: 16
  },
  'Shree-ganda': {
    primary: '#C5A059',
    secondary: '#8B1E1E',
    brandName: 'Shree Ganda',
    forbiddenColors: [
      '#9c27b0', '#4a148c',
      'rgba(156, 39, 176', 'rgba(156,39,176)', 'rgba(74, 20, 140', 'rgba(74,20,140)',
      'rgb(156, 39, 176)', 'rgb(156,39,176)', 'rgb(156, 39, 176',
      'rgb(74, 20, 140)', 'rgb(74,20,140)', 'rgb(74, 20, 140'
    ],
    forbiddenColorRegexes: [
      /#9c27b0/i,
      /#4a148c/i,
      /rgba?\s*\(\s*156\s*,\s*39\s*,\s*176/i,
      /rgba?\s*\(\s*74\s*,\s*20\s*,\s*140/i
    ],
    maxAllowedRadius: 16
  }
};

const FORBIDDEN_EMOJIS = ['❤️', '⭐', '🥈', '🔥', '🎉', '🏷️', '💎', '✨', '💍'];

function normalizeHex(hex) {
  if (!hex || typeof hex !== 'string') return '';
  let clean = hex.trim().toLowerCase();
  if (clean.startsWith('#') && clean.length === 4) {
    clean = '#' + clean[1] + clean[1] + clean[2] + clean[2] + clean[3] + clean[3];
  }
  return clean;
}

function hexToRgb(hex) {
  const norm = normalizeHex(hex).replace('#', '');
  if (norm.length !== 6) return null;
  const num = parseInt(norm, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255
  };
}

function calculateLuminance({ r, g, b }) {
  const a = [r, g, b].map(v => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

function calculateContrastRatio(hex1, hex2) {
  const rgb1 = hexToRgb(hex1);
  const rgb2 = hexToRgb(hex2);
  if (!rgb1 || !rgb2) return 1;
  const lum1 = calculateLuminance(rgb1);
  const lum2 = calculateLuminance(rgb2);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
}

function checkThemeCompliance(appName, themeConfig) {
  const spec = THEME_SPECS[appName];
  if (!spec) {
    throw new Error(`Unknown app name for theme spec: ${appName}`);
  }

  const issues = [];

  const actualPrimary = normalizeHex(themeConfig?.palette?.primary?.main || themeConfig?.primary);
  const actualSecondary = normalizeHex(themeConfig?.palette?.secondary?.main || themeConfig?.secondary);

  if (actualPrimary !== normalizeHex(spec.primary)) {
    issues.push(`Primary color mismatch: expected ${spec.primary}, got ${actualPrimary}`);
  }

  if (actualSecondary !== normalizeHex(spec.secondary)) {
    issues.push(`Secondary color mismatch: expected ${spec.secondary}, got ${actualSecondary}`);
  }

  return {
    compliant: issues.length === 0,
    issues,
    spec
  };
}

function scanTextForForbiddenElements(sourceText, appName) {
  const spec = THEME_SPECS[appName] || {};
  const violations = [];

  // Check forbidden colors by string and regex (handles rgb, rgba, hex, and arbitrary whitespace)
  if (spec.forbiddenColors) {
    for (const forbidden of spec.forbiddenColors) {
      if (sourceText.toLowerCase().includes(forbidden.toLowerCase())) {
        violations.push(`Found forbidden color string: "${forbidden}"`);
      }
    }
  }
  if (spec.forbiddenColorRegexes) {
    for (const regex of spec.forbiddenColorRegexes) {
      if (regex.test(sourceText)) {
        const alreadyFlagged = violations.some(v => v.includes('forbidden color'));
        if (!alreadyFlagged) {
          violations.push(`Found forbidden color pattern: ${regex}`);
        }
      }
    }
  }

  for (const emoji of FORBIDDEN_EMOJIS) {
    if (sourceText.includes(emoji)) {
      violations.push(`Found forbidden emoji icon: "${emoji}"`);
    }
  }

  // 1. Literal pill keywords and percentages
  const pillKeywords = [
    /border-radius\s*:\s*(?:50%|9999px|999px|full)/i,
    /borderRadius\s*:\s*['"]?(?:50%|9999px|999px|full)['"]?/i,
    /\brounded-full\b/i
  ];
  for (const pat of pillKeywords) {
    if (pat.test(sourceText)) {
      violations.push(`Found forbidden excessive/pill border radius pattern: ${pat}`);
    }
  }

  // 2. Numeric border radius extraction (> 16px)
  const numericRadiusRegex = /(?:border-radius|borderRadius)\s*[:=]\s*['"]?(\d+)(?:px)?['"]?/gi;
  let match;
  while ((match = numericRadiusRegex.exec(sourceText)) !== null) {
    const value = parseInt(match[1], 10);
    if (value > (spec.maxAllowedRadius || 16)) {
      violations.push(`Found forbidden excessive border radius (${value}px > ${spec.maxAllowedRadius || 16}px max allowed)`);
    }
  }

  return {
    clean: violations.length === 0,
    violations
  };
}

module.exports = {
  THEME_SPECS,
  FORBIDDEN_EMOJIS,
  normalizeHex,
  calculateContrastRatio,
  checkThemeCompliance,
  scanTextForForbiddenElements
};
