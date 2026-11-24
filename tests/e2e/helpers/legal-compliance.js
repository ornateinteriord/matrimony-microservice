/**
 * Legal and compliance verification helpers for R5 / F9 / F15 / F21.
 * Validates:
 * - Digital Personal Data Protection Act (DPDP) 2023 mandatory clauses
 * - Terms & Conditions core covenants
 * - Cookie consent state transitions and persistence
 * - Zero placeholder text (anti-slop audit)
 */

const FORBIDDEN_PLACEHOLDER_PATTERNS = [
  /lorem\s+ipsum/i,
  /\bTODO\b/,
  /\[insert\s+[^\]]+\]/i,
  /placeholder/i,
  /your\s+company\s+name/i,
  /example\.com/i,
  /xyz\s+road/i
];

function scanForPlaceholders(text) {
  if (typeof text !== 'string') return { clean: false, errors: ['Input must be a string'] };
  const detected = [];
  for (const pattern of FORBIDDEN_PLACEHOLDER_PATTERNS) {
    if (pattern.test(text)) {
      detected.push(`Found forbidden placeholder pattern: ${pattern}`);
    }
  }
  return {
    clean: detected.length === 0,
    detected
  };
}

function verifyDpdp2023Compliance(privacyPolicyText) {
  if (typeof privacyPolicyText !== 'string') {
    return { compliant: false, errors: ['Privacy policy text must be a string'] };
  }

  const errors = [];
  const requiredClauses = [
    { name: 'DPDP Act Reference', regex: /Digital\s+Personal\s+Data\s+Protection|DPDP\s*(?:Act)?\s*2023/i },
    { name: 'Data Principal Rights', regex: /rights?\s+of\s+(?:the\s+)?data\s+principal|right\s+to\s+(?:access|correct|erase|withdraw)/i },
    { name: 'Grievance Officer / DPO', regex: /grievance\s+(?:redressal|officer)|data\s+protection\s+officer|\bDPO\b/i },
    { name: 'Official Contact Email', regex: /[\w.-]+@[\w.-]+\.[a-z]{2,}/i },
    { name: 'Data Retention / Erasure', regex: /\b(?:retention|erasure|deletion\s+of\s+data)\b/i }
  ];

  for (const clause of requiredClauses) {
    if (!clause.regex.test(privacyPolicyText)) {
      errors.push(`Missing mandatory DPDP 2023 clause: ${clause.name}`);
    }
  }

  // Check for placeholders
  const placeholderCheck = scanForPlaceholders(privacyPolicyText);
  if (!placeholderCheck.clean) {
    errors.push(...placeholderCheck.detected);
  }

  return {
    compliant: errors.length === 0,
    errors
  };
}

function verifyTermsAndConditions(termsText) {
  if (typeof termsText !== 'string') {
    return { compliant: false, errors: ['Terms text must be a string'] };
  }

  const errors = [];
  const requiredClauses = [
    { name: 'Eligibility Criteria', regex: /eligibility|minimum\s+age|18\s*years/i },
    { name: 'Account Termination', regex: /termination|suspend|close\s+account/i },
    { name: 'Code of Conduct', regex: /conduct|prohibited|misuse/i },
    { name: 'Dispute Jurisdiction', regex: /governing\s+law|jurisdiction|courts\s+of/i }
  ];

  for (const clause of requiredClauses) {
    if (!clause.regex.test(termsText)) {
      errors.push(`Missing mandatory Terms clause: ${clause.name}`);
    }
  }

  const placeholderCheck = scanForPlaceholders(termsText);
  if (!placeholderCheck.clean) {
    errors.push(...placeholderCheck.detected);
  }

  return {
    compliant: errors.length === 0,
    errors
  };
}

function createCookieConsentManager(initialStorage = {}) {
  const store = { ...initialStorage };
  const STORAGE_KEY = 'matrimony_cookie_consent';

  return {
    getConsent: () => {
      const val = store[STORAGE_KEY];
      return val ? JSON.parse(val) : null;
    },
    acceptAll: () => {
      const record = {
        essential: true,
        analytics: true,
        marketing: true,
        timestamp: new Date().toISOString()
      };
      store[STORAGE_KEY] = JSON.stringify(record);
      return record;
    },
    acceptNecessaryOnly: () => {
      const record = {
        essential: true,
        analytics: false,
        marketing: false,
        timestamp: new Date().toISOString()
      };
      store[STORAGE_KEY] = JSON.stringify(record);
      return record;
    },
    hasConsented: () => Boolean(store[STORAGE_KEY]),
    getStoreSnapshot: () => ({ ...store })
  };
}

module.exports = {
  scanForPlaceholders,
  verifyDpdp2023Compliance,
  verifyTermsAndConditions,
  createCookieConsentManager
};
