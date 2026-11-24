/**
 * Core test assertion utilities for E2E testing framework.
 * Zero external binary dependencies, uses standard Node.js assert.
 */
const assert = require('assert');

function assertOk(value, message) {
  assert.ok(value, message || `Expected truthy value, got ${JSON.stringify(value)}`);
}

function assertEqual(actual, expected, message) {
  assert.strictEqual(
    actual,
    expected,
    message || `Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`
  );
}

function assertDeepEqual(actual, expected, message) {
  assert.deepStrictEqual(actual, expected, message);
}

function assertMatch(str, regex, message) {
  assert.ok(
    regex.test(str),
    message || `Expected string to match ${regex}, got: ${str}`
  );
}

function assertDoesNotMatch(str, regex, message) {
  assert.ok(
    !regex.test(str),
    message || `Expected string NOT to match ${regex}, got: ${str}`
  );
}

function assertContains(haystack, needle, message) {
  assert.ok(
    haystack.includes(needle),
    message || `Expected substring "${needle}" inside string of length ${haystack.length}`
  );
}

function assertNotContains(haystack, needle, message) {
  assert.ok(
    !haystack.includes(needle),
    message || `Expected string NOT to contain "${needle}"`
  );
}

function assertColorHex(actual, expectedHex, message) {
  const normActual = String(actual).toLowerCase().trim();
  const normExpected = String(expectedHex).toLowerCase().trim();
  assert.strictEqual(
    normActual,
    normExpected,
    message || `Theme color mismatch: expected ${normExpected}, got ${normActual}`
  );
}

function assertThrows(fn, expectedErrorOrRegex, message) {
  let threw = false;
  try {
    fn();
  } catch (err) {
    threw = true;
    if (expectedErrorOrRegex instanceof RegExp) {
      assert.ok(expectedErrorOrRegex.test(err.message), `Error message "${err.message}" did not match ${expectedErrorOrRegex}`);
    } else if (typeof expectedErrorOrRegex === 'function') {
      assert.ok(err instanceof expectedErrorOrRegex, `Error ${err} is not instance of ${expectedErrorOrRegex.name}`);
    }
  }
  assert.ok(threw, message || 'Expected function to throw an error');
}

module.exports = {
  assertOk,
  assertEqual,
  assertDeepEqual,
  assertMatch,
  assertDoesNotMatch,
  assertContains,
  assertNotContains,
  assertColorHex,
  assertThrows
};
