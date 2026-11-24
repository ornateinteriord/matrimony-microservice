/**
 * Tier 2 Boundary Test Suite: F1 - TypeScript & Build Infra Boundaries
 * Verifies edge cases, malformed configs, missing scripts, and syntax violations.
 */

const {
  validateWorkspacesConfig,
  validatePackageBuildScript,
  detectJsxInTs,
  validateCompilerOptions
} = require('../helpers/contracts');
const { assertOk, assertThrows, assertEqual } = require('../helpers/assertions');

module.exports = {
  id: 'F01-BVA',
  name: 'Build Infra Boundary & Negative Tests',
  tier: 'tier2',
  tests: [
    {
      name: 'TC-F01-B01: Parser detects and flags malformed JSON in config files',
      fn: async () => {
        const malformedJson = '{ "name": "bad-json", "workspaces": [ "apps/*", ] }';
        assertThrows(() => JSON.parse(malformedJson), SyntaxError, 'Must throw SyntaxError on malformed JSON');
      }
    },
    {
      name: 'TC-F01-B02: Validator rejects configuration with empty or missing workspaces',
      fn: async () => {
        assertThrows(() => validateWorkspacesConfig({}), /Workspaces must be a non-empty array/);
        assertThrows(() => validateWorkspacesConfig({ workspaces: [] }), /Workspaces must be a non-empty array/);
      }
    },
    {
      name: 'TC-F01-B03: Detects missing build script in workspace package definition',
      fn: async () => {
        assertThrows(() => validatePackageBuildScript({ scripts: { dev: 'vite' } }), /Missing required build script/);
        assertEqual(validatePackageBuildScript({ scripts: { build: 'tsc && vite build' } }), true);
      }
    },
    {
      name: 'TC-F01-B04: JSX syntax detector flags JSX elements embedded in standard .ts file',
      fn: async () => {
        const invalidTs = 'export const Component = () => <div>Hello</div>;';
        assertThrows(() => detectJsxInTs('Calendar.ts', invalidTs), /JSX detected in .ts file/);
        assertEqual(detectJsxInTs('Calendar.tsx', invalidTs), true);
      }
    },
    {
      name: 'TC-F01-B05: Tsconfig validator rejects unknown or deprecated compilerOptions target',
      fn: async () => {
        assertThrows(() => validateCompilerOptions({ jsx: 'invalid-jsx-mode' }), /Invalid jsx option/);
        assertEqual(validateCompilerOptions({ jsx: 'react-jsx' }), true);
      }
    }
  ]
};
