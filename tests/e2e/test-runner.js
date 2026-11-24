#!/usr/bin/env node
/**
 * Canonical Automated E2E Test Runner for Matrimony Microservice.
 *
 * Requirements & Execution:
 *   node tests/e2e/test-runner.js
 *   node tests/e2e/test-runner.js --tier=1
 *   node tests/e2e/test-runner.js --tier=2
 *   node tests/e2e/test-runner.js --tier=3
 *   node tests/e2e/test-runner.js --tier=4
 *   node tests/e2e/test-runner.js --filter=<suite_or_feature>
 *
 * Zero external binary dependencies. Uses standard Node.js built-ins.
 * Exits with 0 on 100% pass, non-zero on any failure.
 */

const fs = require('fs');
const path = require('path');

const TIERS = [
  { key: 'tier1', dir: 'tier1-features', name: 'Tier 1 - Feature Coverage (Happy Path)' },
  { key: 'tier2', dir: 'tier2-boundaries', name: 'Tier 2 - Boundary Value & Edge Cases' },
  { key: 'tier3', dir: 'tier3-combinations', name: 'Tier 3 - Cross-Feature Combinations' },
  { key: 'tier4', dir: 'tier4-realworld', name: 'Tier 4 - Real-World Application Journeys' }
];

function parseCliArgs() {
  const args = process.argv.slice(2);
  const options = {
    tier: null,
    filter: null,
    verbose: true
  };

  for (const arg of args) {
    if (arg.startsWith('--tier=')) {
      options.tier = arg.split('=')[1].trim().toLowerCase();
      if (!options.tier.startsWith('tier')) {
        options.tier = 'tier' + options.tier;
      }
    } else if (arg.startsWith('--filter=')) {
      options.filter = arg.split('=')[1].trim().toLowerCase();
    }
  }

  return options;
}

function loadSuitesFromDir(dirPath) {
  if (!fs.existsSync(dirPath)) return [];
  const files = fs.readdirSync(dirPath)
    .filter(f => f.endsWith('.test.js'))
    .sort();

  const suites = [];
  for (const file of files) {
    const fullPath = path.join(dirPath, file);
    try {
      const suiteModule = require(fullPath);
      suites.push({
        file,
        fullPath,
        ...suiteModule
      });
    } catch (err) {
      console.error(`Error loading test file ${file}:`, err);
      suites.push({
        file,
        fullPath,
        id: file,
        name: file,
        loadError: err,
        tests: []
      });
    }
  }
  return suites;
}

async function runTest(testDef) {
  const start = Date.now();
  try {
    if (typeof testDef.fn === 'function') {
      await testDef.fn();
    }
    const duration = Date.now() - start;
    return { status: 'passed', duration, error: null };
  } catch (err) {
    const duration = Date.now() - start;
    return { status: 'failed', duration, error: err };
  }
}

async function main() {
  const options = parseCliArgs();
  const baseDir = __dirname;

  console.log('='.repeat(78));
  console.log('   MATRIMONY MICROSERVICE - AUTOMATED E2E TEST SUITE RUNNER');
  console.log('='.repeat(78));
  console.log(`Timestamp: ${new Date().toISOString()}`);
  console.log(`Node:      ${process.version} | Platform: ${process.platform} (${process.arch})`);
  console.log(`Target:    c:\\Users\\abub5\\OneDrive\\Desktop\\matrimony-microservice`);
  if (options.tier) console.log(`Filter:    Tier = ${options.tier}`);
  if (options.filter) console.log(`Filter:    Pattern = ${options.filter}`);
  console.log('-'.repeat(78));

  let totalTests = 0;
  let passedTests = 0;
  let failedTests = 0;
  const failureReports = [];
  const tierSummaries = [];

  const startTime = Date.now();

  for (const tierDef of TIERS) {
    if (options.tier && options.tier !== tierDef.key) {
      continue;
    }

    const tierPath = path.join(baseDir, tierDef.dir);
    const suites = loadSuitesFromDir(tierPath);

    console.log(`\n>>> [${tierDef.name.toUpperCase()}] (${suites.length} suites found)`);
    console.log('-'.repeat(78));

    let tierPassed = 0;
    let tierFailed = 0;

    for (const suite of suites) {
      if (options.filter) {
        const matches = (suite.id && suite.id.toLowerCase().includes(options.filter)) ||
                        (suite.name && suite.name.toLowerCase().includes(options.filter)) ||
                        suite.file.toLowerCase().includes(options.filter);
        if (!matches) continue;
      }

      console.log(`\n  • Suite: [${suite.id || suite.file}] ${suite.name || ''}`);

      if (suite.loadError) {
        tierFailed++;
        failedTests++;
        totalTests++;
        failureReports.push({
          suite: suite.file,
          test: 'Suite Load Failure',
          error: suite.loadError
        });
        console.log(`    [FAIL] Failed to load suite: ${suite.loadError.message}`);
        continue;
      }

      if (!suite.tests || suite.tests.length === 0) {
        console.log(`    (No tests declared)`);
        continue;
      }

      for (const t of suite.tests) {
        totalTests++;
        const res = await runTest(t);
        if (res.status === 'passed') {
          passedTests++;
          tierPassed++;
          console.log(`    [PASS] ${t.name} (${res.duration}ms)`);
        } else {
          failedTests++;
          tierFailed++;
          failureReports.push({
            suite: suite.file,
            test: t.name,
            error: res.error
          });
          console.log(`    [FAIL] ${t.name} (${res.duration}ms)`);
          console.log(`           Error: ${res.error.message}`);
        }
      }
    }

    tierSummaries.push({
      tier: tierDef.key,
      name: tierDef.name,
      passed: tierPassed,
      failed: tierFailed,
      total: tierPassed + tierFailed
    });
  }

  const totalDuration = ((Date.now() - startTime) / 1000).toFixed(2);

  console.log('\n' + '='.repeat(78));
  console.log('                          TEST EXECUTION SUMMARY');
  console.log('='.repeat(78));
  for (const ts of tierSummaries) {
    console.log(`  ${ts.name.padEnd(52)} : ${ts.passed} passed, ${ts.failed} failed (${ts.total} total)`);
  }
  console.log('-'.repeat(78));
  console.log(`  TOTAL TESTS EXECUTED : ${totalTests}`);
  console.log(`  PASSED               : ${passedTests}`);
  console.log(`  FAILED               : ${failedTests}`);
  console.log(`  TOTAL DURATION       : ${totalDuration}s`);
  console.log('='.repeat(78));

  if (failureReports.length > 0) {
    console.log('\nDETAILED FAILURE REPORTS:');
    console.log('-'.repeat(78));
    failureReports.forEach((f, idx) => {
      console.log(`[${idx + 1}] Suite: ${f.suite} | Test: ${f.test}`);
      console.log(`    Message: ${f.error?.message}`);
      if (f.error?.stack) {
        console.log(`    Stack:   ${f.error.stack.split('\n').slice(1, 4).map(s => s.trim()).join('\n             ')}`);
      }
      console.log();
    });
    process.exit(1);
  }

  console.log('\n>>> ALL TEST SUITES PASSED CLEANLY (100% SUCCESS RATE)\n');
  process.exit(0);
}

if (require.main === module) {
  main().catch(err => {
    console.error('Fatal runner error:', err);
    process.exit(1);
  });
}

module.exports = { main, runTest, loadSuitesFromDir, TIERS };

