/**
 * Tier 1 Test Suite: F1 - TypeScript & Build Infra Fixes
 * Verifies monorepo build configuration, workspace definitions, tsconfig rules,
 * and component file extension conventions.
 */

const fs = require('fs');
const path = require('path');
const { assertOk, assertEqual, assertMatch } = require('../helpers/assertions');

const ROOT_DIR = path.resolve(__dirname, '../../..');

module.exports = {
  id: 'F01',
  name: 'TypeScript & Build Infra Fixes',
  tier: 'tier1',
  tests: [
    {
      name: 'TC-F01-01: Root package.json defines npm workspaces for apps/* and backend/*',
      fn: async () => {
        const pkgPath = path.join(ROOT_DIR, 'package.json');
        assertOk(fs.existsSync(pkgPath), 'Root package.json must exist');
        const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
        assertOk(Array.isArray(pkg.workspaces), 'workspaces must be an array');
        assertOk(pkg.workspaces.includes('apps/*'), 'workspaces must include apps/*');
        assertOk(pkg.workspaces.includes('backend/*'), 'workspaces must include backend/*');
      }
    },
    {
      name: 'TC-F01-02: Root turbo.json defines valid pipeline tasks',
      fn: async () => {
        const turboPath = path.join(ROOT_DIR, 'turbo.json');
        assertOk(fs.existsSync(turboPath), 'turbo.json must exist');
        const turbo = JSON.parse(fs.readFileSync(turboPath, 'utf8'));
        assertOk(turbo.tasks || turbo.pipeline, 'turbo.json must define tasks or pipeline');
      }
    },
    {
      name: 'TC-F01-03: Workspace apps have package.json with build script',
      fn: async () => {
        const apps = ['Girija-Kalyana', 'Sangam-sathi', 'Shree-ganda'];
        for (const app of apps) {
          const appPkgPath = path.join(ROOT_DIR, 'apps', app, 'package.json');
          assertOk(fs.existsSync(appPkgPath), `${app} must have package.json`);
          const appPkg = JSON.parse(fs.readFileSync(appPkgPath, 'utf8'));
          assertOk(appPkg.scripts && appPkg.scripts.build, `${app} package.json must have build script`);
        }
      }
    },
    {
      name: 'TC-F01-04: Component files with JSX avoid raw .ts extension (Calendar JSX fix)',
      fn: async () => {
        const apps = ['Girija-Kalyana', 'Sangam-sathi', 'Shree-ganda'];
        for (const app of apps) {
          const calendarTs = path.join(ROOT_DIR, 'apps', app, 'src', 'components', 'Calendar.ts');
          const calendarTsx = path.join(ROOT_DIR, 'apps', app, 'src', 'components', 'Calendar.tsx');
          
          // Verify legacy .ts file is strictly removed
          assertOk(!fs.existsSync(calendarTs), `Legacy Calendar.ts must be deleted in ${app}`);
          
          // Verify modern .tsx replacement strictly exists
          assertOk(fs.existsSync(calendarTsx), `Calendar.tsx must exist as replacement in ${app}`);
          
          // Verify .tsx contains valid JSX syntax
          const content = fs.readFileSync(calendarTsx, 'utf8');
          const hasJsx = /<[A-Za-z]+(\s+[^>]*)?>.*<\/[A-Za-z]+>/s.test(content) || /<[A-Za-z]+(\s+[^>]*)?\/>/.test(content);
          assertOk(hasJsx, `Calendar.tsx in ${app} must contain valid JSX syntax`);
        }
      }
    },
    {
      name: 'TC-F01-05: Workspace tsconfig files configure React JSX compilerOptions',
      fn: async () => {
        const apps = ['Girija-Kalyana', 'Sangam-sathi', 'Shree-ganda'];
        for (const app of apps) {
          const tsconfigAppPath = path.join(ROOT_DIR, 'apps', app, 'tsconfig.app.json');
          const tsconfigPath = path.join(ROOT_DIR, 'apps', app, 'tsconfig.json');
          const targetPath = fs.existsSync(tsconfigAppPath) ? tsconfigAppPath : tsconfigPath;
          assertOk(fs.existsSync(targetPath), `${app} must have a tsconfig file`);
          const raw = fs.readFileSync(targetPath, 'utf8');
          // Strip comments before parsing JSON
          const stripped = raw.replace(/\/\*[\s\S]*?\*\/|([^:]|^)\/\/.*$/gm, '$1');
          const tsconfig = JSON.parse(stripped);
          const compilerOptions = tsconfig.compilerOptions || {};
          assertOk(
            compilerOptions.jsx === 'react-jsx' || compilerOptions.jsx === 'react' || compilerOptions.jsx === 'preserve',
            `${app} tsconfig must configure jsx compilerOptions`
          );
        }
      }
    }
  ]
};
