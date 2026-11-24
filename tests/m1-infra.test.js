const fs = require('fs');
const path = require('path');
const assert = require('assert');

const ROOT = path.resolve(__dirname, '..');
const APPS = ['Girija-Kalyana', 'Sangam-sathi', 'Shree-ganda'];

console.log('--- RUNNING M1 QUALITY INFRASTRUCTURE VERIFICATION SUITE ---\n');

let totalTests = 0;
let passedTests = 0;

function test(name, fn) {
  totalTests++;
  try {
    fn();
    passedTests++;
    console.log(`  ✓ ${name}`);
  } catch (err) {
    console.error(`  ✗ ${name}`);
    console.error(`    ${err.message}`);
  }
}

// 1. Calendar.tsx renames
for (const app of APPS) {
  test(`${app}: Calendar.ts renamed to Calendar.tsx`, () => {
    const tsxPath = path.join(ROOT, 'apps', app, 'src', 'components', 'Calendar.tsx');
    const tsPath = path.join(ROOT, 'apps', app, 'src', 'components', 'Calendar.ts');
    assert.strictEqual(fs.existsSync(tsxPath), true, `Calendar.tsx must exist in ${app}`);
    assert.strictEqual(fs.existsSync(tsPath), false, `Calendar.ts must NOT exist in ${app}`);
  });
}

// 2. Root package.json build:workspaces
test('Root package.json includes build:workspaces script', () => {
  const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'));
  assert.strictEqual(
    pkg.scripts['build:workspaces'],
    'npm run build --workspaces --if-present',
    'Root package.json must have build:workspaces script'
  );
});

// 3. Frontend package.json typecheck script
for (const app of APPS) {
  test(`${app}: package.json includes typecheck script`, () => {
    const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, 'apps', app, 'package.json'), 'utf8'));
    assert.strictEqual(
      pkg.scripts.typecheck,
      'tsc --noEmit',
      `${app} package.json must have typecheck: "tsc --noEmit"`
    );
  });
}

// 4. ESLint configs
for (const app of APPS) {
  test(`${app}: eslint.config.js checks **/*.{js,jsx,ts,tsx}`, () => {
    const eslintPath = path.join(ROOT, 'apps', app, 'eslint.config.js');
    assert.strictEqual(fs.existsSync(eslintPath), true, `eslint.config.js must exist in ${app}`);
    const content = fs.readFileSync(eslintPath, 'utf8');
    assert.strictEqual(
      content.includes("**/*.{js,jsx,ts,tsx}"),
      true,
      `eslint.config.js in ${app} must include **/*.{js,jsx,ts,tsx}`
    );
  });
}

// 5. Shared Interface Contracts
for (const app of APPS) {
  test(`${app}: src/types/navigation.ts defines NavItemConfig and SidebarConfig`, () => {
    const filePath = path.join(ROOT, 'apps', app, 'src', 'types', 'navigation.ts');
    assert.strictEqual(fs.existsSync(filePath), true, `navigation.ts must exist in ${app}`);
    const content = fs.readFileSync(filePath, 'utf8');
    assert.strictEqual(content.includes('export interface NavItemConfig'), true);
    assert.strictEqual(content.includes('export interface SidebarConfig'), true);
    assert.strictEqual(content.includes('brandTitle: string;'), true);
    assert.strictEqual(content.includes('homePath: string;'), true);
    assert.strictEqual(content.includes('items: NavItemConfig[];'), true);
  });

  test(`${app}: src/types/sponsor.ts defines SponsorLockState`, () => {
    const filePath = path.join(ROOT, 'apps', app, 'src', 'types', 'sponsor.ts');
    assert.strictEqual(fs.existsSync(filePath), true, `sponsor.ts must exist in ${app}`);
    const content = fs.readFileSync(filePath, 'utf8');
    assert.strictEqual(content.includes('export interface SponsorLockState'), true);
    assert.strictEqual(content.includes('code: string;'), true);
    assert.strictEqual(content.includes('promoterName: string;'), true);
    assert.strictEqual(content.includes('isLocked: boolean;'), true);
    assert.strictEqual(content.includes('isVerified: boolean;'), true);
    assert.strictEqual(content.includes('isAutoPopulated: boolean;'), true);
    assert.strictEqual(content.includes('error: string | null;'), true);
  });

  test(`${app}: src/types/seo.ts defines PageMetadata`, () => {
    const filePath = path.join(ROOT, 'apps', app, 'src', 'types', 'seo.ts');
    assert.strictEqual(fs.existsSync(filePath), true, `seo.ts must exist in ${app}`);
    const content = fs.readFileSync(filePath, 'utf8');
    assert.strictEqual(content.includes('export interface PageMetadata'), true);
    assert.strictEqual(content.includes('title: string;'), true);
    assert.strictEqual(content.includes('description: string;'), true);
    assert.strictEqual(content.includes('canonicalUrl?: string;'), true);
    assert.strictEqual(content.includes('structuredData?: Record<string, unknown>;'), true);
  });
}

// 6. Backend Promoter Route Verification
const BACKENDS = ['matrimony-service', 'shree-gandha-server'];
for (const be of BACKENDS) {
  test(`${be}: promoter route verifies promocheck and returns promoterName`, () => {
    const routePath = path.join(ROOT, 'backend', be, 'routes', 'promoter.routes.js');
    assert.strictEqual(fs.existsSync(routePath), true, `promoter.routes.js must exist in ${be}`);
    const content = fs.readFileSync(routePath, 'utf8');
    assert.strictEqual(content.includes("router.post('/promocheck'"), true);
    assert.strictEqual(content.includes("promoter_name"), true);
    assert.strictEqual(content.includes("promoterName: promoter.promoter_name"), true);
    assert.strictEqual(content.includes("status: 'active'"), true);
  });
}

console.log(`\nResults: ${passedTests}/${totalTests} tests passed.`);
if (passedTests !== totalTests) {
  process.exit(1);
} else {
  console.log('VERDICT: PASS');
}
