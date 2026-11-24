/**
 * Mobile navigation and app-like interface verification helpers for R1 / F5 / F11 / F17.
 * Validates:
 * - Viewport responsive breakpoints (desktop vs mobile)
 * - BottomNavigation structure and tab definitions
 * - Safe area padding constraints
 */

const STANDARD_MOBILE_TABS = [
  { id: 'home', label: 'Home', path: '/' },
  { id: 'matches', label: 'Matches', path: '/matches' },
  { id: 'interests', label: 'Interests', path: '/interests' },
  { id: 'chat', label: 'Chat', path: '/chat' },
  { id: 'profile', label: 'Profile', path: '/profile' }
];

function isMobileViewport(width) {
  if (typeof width !== 'number' || width < 0) return false;
  return width <= 768; // Material UI 'md' breakpoint standard
}

function validateBottomNavConfig(tabs) {
  const errors = [];
  if (!Array.isArray(tabs)) {
    return { valid: false, errors: ['Tabs configuration must be an array'] };
  }

  if (tabs.length === 0) {
    errors.push('Bottom navigation must specify at least 1 tab');
  }

  if (tabs.length > 5) {
    errors.push(`Bottom navigation has ${tabs.length} tabs; maximum recommended is 5 for mobile usability`);
  }

  tabs.forEach((tab, idx) => {
    if (!tab.id || typeof tab.id !== 'string') {
      errors.push(`Tab at index ${idx} missing string id`);
    }
    if (!tab.label || typeof tab.label !== 'string') {
      errors.push(`Tab at index ${idx} missing string label`);
    }
    if (!tab.path || typeof tab.path !== 'string') {
      errors.push(`Tab at index ${idx} missing string path`);
    }
  });

  return {
    valid: errors.length === 0,
    errors,
    tabCount: tabs.length
  };
}

function createMobileNavigationState(tabs = STANDARD_MOBILE_TABS, initialPath = '/') {
  let activePath = initialPath;
  let isDrawerOpen = false;

  return {
    getActiveTab: () => tabs.find(t => t.path === activePath) || null,
    setActivePath: (path) => {
      activePath = path;
    },
    toggleDrawer: () => {
      isDrawerOpen = !isDrawerOpen;
      return isDrawerOpen;
    },
    isDrawerOpen: () => isDrawerOpen,
    getTabs: () => [...tabs]
  };
}

function validateSafeAreaRule(css) {
  if (!css || typeof css !== 'string') return false;
  // Must use env(safe-area-inset-*) with a comma and fallback value
  return /env\(\s*safe-area-inset-(?:bottom|top|left|right)\s*,\s*[^)]+\)/i.test(css);
}

module.exports = {
  STANDARD_MOBILE_TABS,
  isMobileViewport,
  validateBottomNavConfig,
  createMobileNavigationState,
  validateSafeAreaRule
};
