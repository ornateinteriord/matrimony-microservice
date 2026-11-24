/**
 * Workspace Resolver Utility for E2E Tests
 * Provides standard, cross-platform path resolution and file inspection for apps and backend.
 */
const path = require('path');
const fs = require('fs');

const ROOT_DIR = path.resolve(__dirname, '../../..');

function getAppPath(appName, ...subPaths) {
  return path.join(ROOT_DIR, 'apps', appName, ...subPaths);
}

function getBackendPath(serviceName, ...subPaths) {
  return path.join(ROOT_DIR, 'backend', serviceName, ...subPaths);
}

function appFileExists(appName, ...subPaths) {
  return fs.existsSync(getAppPath(appName, ...subPaths));
}

function readAppFile(appName, ...subPaths) {
  const target = getAppPath(appName, ...subPaths);
  if (!fs.existsSync(target)) {
    throw new Error(`[WORKSPACE MISSING] Required file does not exist: apps/${appName}/${subPaths.join('/')}`);
  }
  return fs.readFileSync(target, 'utf8');
}

function readBackendFile(serviceName, ...subPaths) {
  const target = getBackendPath(serviceName, ...subPaths);
  if (!fs.existsSync(target)) {
    throw new Error(`[WORKSPACE MISSING] Required file does not exist: backend/${serviceName}/${subPaths.join('/')}`);
  }
  return fs.readFileSync(target, 'utf8');
}

module.exports = {
  ROOT_DIR,
  getAppPath,
  getBackendPath,
  appFileExists,
  readAppFile,
  readBackendFile
};
