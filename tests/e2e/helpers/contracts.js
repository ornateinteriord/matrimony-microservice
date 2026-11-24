/**
 * Contract verification helpers for shared interfaces defined in PROJECT.md:
 * 1. NavItemConfig
 * 2. SidebarConfig
 * 3. SponsorLockState
 * 4. PageMetadata
 */

function validateNavItemConfig(item, depth = 0) {
  const errors = [];
  if (depth > 10) {
    errors.push(`Navigation hierarchy exceeds maximum safe depth of 10 at item: ${JSON.stringify(item)}`);
    return { valid: false, errors };
  }

  if (!item || typeof item !== 'object') {
    return { valid: false, errors: ['NavItemConfig must be an object'] };
  }

  if (typeof item.id !== 'string' || !item.id.trim()) {
    errors.push('NavItemConfig.id must be a non-empty string');
  }
  if (typeof item.title !== 'string' || !item.title.trim()) {
    errors.push('NavItemConfig.title must be a non-empty string');
  }
  if (typeof item.path !== 'string') {
    errors.push('NavItemConfig.path must be a string');
  }
  if (!item.icon) {
    errors.push('NavItemConfig.icon is required (string or component)');
  }

  if (item.badge !== undefined && typeof item.badge !== 'string' && typeof item.badge !== 'number') {
    errors.push('NavItemConfig.badge must be a string or number if provided');
  }

  if (item.roles !== undefined) {
    if (!Array.isArray(item.roles) || !item.roles.every(r => typeof r === 'string')) {
      errors.push('NavItemConfig.roles must be an array of strings if provided');
    }
  }

  if (item.children !== undefined) {
    if (!Array.isArray(item.children)) {
      errors.push('NavItemConfig.children must be an array if provided');
    } else {
      for (const child of item.children) {
        const childRes = validateNavItemConfig(child, depth + 1);
        if (!childRes.valid) {
          errors.push(...childRes.errors);
        }
      }
    }
  }

  return { valid: errors.length === 0, errors };
}

function validateSidebarConfig(config) {
  const errors = [];
  if (!config || typeof config !== 'object') {
    return { valid: false, errors: ['SidebarConfig must be an object'] };
  }

  if (typeof config.brandTitle !== 'string' || !config.brandTitle.trim()) {
    errors.push('SidebarConfig.brandTitle must be a non-empty string');
  }
  if (typeof config.homePath !== 'string') {
    errors.push('SidebarConfig.homePath must be a string');
  }
  if (!Array.isArray(config.items)) {
    errors.push('SidebarConfig.items must be an array');
  } else {
    config.items.forEach((item, idx) => {
      const itemRes = validateNavItemConfig(item);
      if (!itemRes.valid) {
        errors.push(`Item at index ${idx}: ${itemRes.errors.join('; ')}`);
      }
    });
  }

  return { valid: errors.length === 0, errors };
}

function validateSponsorLockState(state) {
  const errors = [];
  if (!state || typeof state !== 'object') {
    return { valid: false, errors: ['SponsorLockState must be an object'] };
  }

  if (typeof state.code !== 'string') {
    errors.push('SponsorLockState.code must be a string');
  }
  if (typeof state.promoterName !== 'string') {
    errors.push('SponsorLockState.promoterName must be a string');
  }
  if (typeof state.isLocked !== 'boolean') {
    errors.push('SponsorLockState.isLocked must be a boolean');
  }
  if (typeof state.isVerified !== 'boolean') {
    errors.push('SponsorLockState.isVerified must be a boolean');
  }
  if (typeof state.isAutoPopulated !== 'boolean') {
    errors.push('SponsorLockState.isAutoPopulated must be a boolean');
  }
  if (state.error !== null && typeof state.error !== 'string') {
    errors.push('SponsorLockState.error must be string or null');
  }

  return { valid: errors.length === 0, errors };
}

function validatePageMetadata(meta) {
  const errors = [];
  if (!meta || typeof meta !== 'object') {
    return { valid: false, errors: ['PageMetadata must be an object'] };
  }

  if (typeof meta.title !== 'string' || !meta.title.trim()) {
    errors.push('PageMetadata.title must be a non-empty string');
  }
  if (typeof meta.description !== 'string' || !meta.description.trim()) {
    errors.push('PageMetadata.description must be a non-empty string');
  }
  if (meta.canonicalUrl !== undefined) {
    if (typeof meta.canonicalUrl !== 'string') {
      errors.push('PageMetadata.canonicalUrl must be a string');
    } else if (!meta.canonicalUrl.startsWith('http://') && !meta.canonicalUrl.startsWith('https://')) {
      errors.push('PageMetadata.canonicalUrl must be an absolute URL starting with http:// or https://');
    }
  }
  if (meta.structuredData !== undefined) {
    if (typeof meta.structuredData !== 'object' || meta.structuredData === null || Array.isArray(meta.structuredData)) {
      errors.push('PageMetadata.structuredData must be a record/object if provided');
    }
  }

  return { valid: errors.length === 0, errors };
}

function validateWorkspacesConfig(pkg) {
  if (!pkg.workspaces || !Array.isArray(pkg.workspaces) || pkg.workspaces.length === 0) {
    throw new Error('Workspaces must be a non-empty array');
  }
  return true;
}

function validatePackageBuildScript(pkg) {
  if (!pkg.scripts || !pkg.scripts.build || typeof pkg.scripts.build !== 'string') {
    throw new Error('Missing required build script');
  }
  return true;
}

function detectJsxInTs(filename, code) {
  if (filename.endsWith('.ts') && !filename.endsWith('.d.ts')) {
    const hasJsx = /<[A-Za-z]+(\s+[^>]*)?>.*<\/[A-Za-z]+>/s.test(code) || /<[A-Za-z]+(\s+[^>]*)?\/>/.test(code);
    if (hasJsx) {
      throw new Error(`JSX detected in .ts file: ${filename}`);
    }
  }
  return true;
}

function validateCompilerOptions(opts) {
  const validJsx = ['react-jsx', 'react', 'preserve'];
  if (!opts || !validJsx.includes(opts.jsx)) {
    throw new Error(`Invalid jsx option: ${opts?.jsx}`);
  }
  return true;
}

module.exports = {
  validateNavItemConfig,
  validateSidebarConfig,
  validateSponsorLockState,
  validatePageMetadata,
  validateWorkspacesConfig,
  validatePackageBuildScript,
  detectJsxInTs,
  validateCompilerOptions
};
