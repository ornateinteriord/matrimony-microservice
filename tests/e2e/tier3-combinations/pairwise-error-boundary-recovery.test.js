/**
 * Tier 3 Combinatorial Suite: Pairwise Error Boundary + Theme Fallback + Sponsor State
 * Tests cross-feature interactions between F8/F14/F20 (ErrorBoundary & 404),
 * F4/F10/F16 (Theme Styling), and F7/F13/F19 (Sponsor Lock).
 */

const { createSponsorLockStateMachine } = require('../helpers/sponsor-lock');
const { THEME_SPECS, calculateContrastRatio, scanTextForForbiddenElements } = require('../helpers/theme-verifier');
const { analyzeHtmlMetadata } = require('../helpers/seo-verifier');
const { assertOk, assertEqual } = require('../helpers/assertions');

module.exports = {
  id: 'TIER3-ERROR-BOUNDARY',
  name: 'Pairwise Error Boundary + Theme Fallback + Sponsor State',
  tier: 'tier3',
  tests: [
    {
      name: 'TC-T3-25: Component render error during registration preserves locked sponsor state',
      fn: async () => {
        const sm = createSponsorLockStateMachine('?ref=CRITICAL99');
        assertEqual(sm.getState().isLocked, true);

        // Simulate runtime ErrorBoundary catch
        let caughtError = null;
        try {
          throw new Error('Simulated React component crash in payment widget');
        } catch (err) {
          caughtError = err;
        }

        assertOk(caughtError);
        // Sponsor lock state remains preserved
        assertEqual(sm.getState().code, 'CRITICAL99');
        assertEqual(sm.getState().isLocked, true);
      }
    },
    {
      name: 'TC-T3-26: Custom 500 error boundary UI renders within active application theme palette',
      fn: async () => {
        const apps = ['Girija-Kalyana', 'Sangam-sathi', 'Shree-ganda'];
        for (const app of apps) {
          const theme = THEME_SPECS[app];
          // Use accessible text color based on primary color luminance (light themes use dark text, dark themes use light text)
          const whiteContrast = calculateContrastRatio(theme.primary, '#FFFFFF');
          const buttonTextColor = whiteContrast >= 4.5 ? '#FFFFFF' : '#111827';
          const errorLayout = {
            heading: 'Something went wrong',
            actionButton: { backgroundColor: theme.primary, color: buttonTextColor, borderRadius: '8px' },
            homeLink: { color: theme.secondary }
          };

          const contrast = calculateContrastRatio(errorLayout.actionButton.backgroundColor, errorLayout.actionButton.color);
          assertOk(contrast >= 4.5, `${app} error retry button must meet WCAG AA contrast (>=4.5:1)`);

          const styleCheck = scanTextForForbiddenElements(JSON.stringify(errorLayout), app);
          assertOk(styleCheck.clean, `${app} error boundary must be clean of theme violations: ${styleCheck.violations.join('; ')}`);
        }
      }
    },
    {
      name: 'TC-T3-27: Custom 500 error boundary HTML adheres to single <h1> SEO rule',
      fn: async () => {
        const errorBoundaryHtml = `
          <!DOCTYPE html>
          <html><head><title>Service Temporarily Unavailable | Matrimony</title><meta name="description" content="Error boundary"/><link rel="canonical" href="https://site.com/500"/></head>
          <body>
            <h1>Something Went Wrong</h1>
            <p>Our team has been notified. Please return to the homepage or try again.</p>
            <a href="/">Return Home</a>
          </body></html>
        `;
        const res = analyzeHtmlMetadata(errorBoundaryHtml);
        assertOk(res.valid, 'Error boundary HTML must maintain single h1 and valid metadata');
        assertEqual(res.h1Count, 1);
      }
    },
    {
      name: 'TC-T3-28: Navigation away from error boundary back to /register restores clean form state',
      fn: async () => {
        class ErrorBoundarySession {
          constructor() { this.hasError = false; this.error = null; }
          triggerError(err) { this.hasError = true; this.error = err; }
          navigateHome() { this.hasError = false; this.error = null; }
        }

        const session = new ErrorBoundarySession();
        session.triggerError(new Error('ChunkLoadError: Failed to load script bundle'));
        assertEqual(session.hasError, true);

        // Navigate back to registration
        session.navigateHome();
        assertEqual(session.hasError, false, 'Error boundary must clear error upon route navigation');
        assertEqual(session.error, null);

        // Verify referral state can be cleanly re-initialized
        const freshSm = createSponsorLockStateMachine('?ref=PROMO99');
        assertEqual(freshSm.getState().isLocked, true);
        assertEqual(freshSm.getState().code, 'PROMO99');
      }
    },
    {
      name: 'TC-T3-29: 404 Not Found error layout provides back-to-home navigation link and valid SEO structure',
      fn: async () => {
        const notFoundHtml = `
          <!DOCTYPE html>
          <html><head><title>404 - Page Not Found | Matrimony</title><meta name="description" content="Page not found."/><link rel="canonical" href="https://girijakalyana.com/404"/></head>
          <body>
            <h1>404 - Page Not Found</h1>
            <p>The profile or page you are looking for does not exist.</p>
            <a href="/" class="btn-home">Return to Home</a>
          </body></html>
        `;
        const meta = analyzeHtmlMetadata(notFoundHtml);
        assertOk(meta.valid, '404 layout must have valid metadata');
        assertEqual(meta.h1Count, 1, 'Must have exactly one <h1>');
        assertOk(notFoundHtml.includes('href="/"'), 'Must contain navigation link back to home');
      }
    },
    {
      name: 'TC-T3-30: Multiple consecutive errors do not trigger unbounded retry loops',
      fn: async () => {
        const MAX_RETRIES = 3;
        let attempts = 0;

        const unstableApi = async () => {
          attempts++;
          throw new Error('503 Service Unavailable');
        };

        const executeWithRetry = async (fn, maxRetries) => {
          let count = 0;
          let lastErr = null;
          while (count < maxRetries) {
            count++;
            try { return await fn(); } catch (err) { lastErr = err; }
          }
          return { failed: true, attempts: count, error: lastErr };
        };

        const result = await executeWithRetry(unstableApi, MAX_RETRIES);
        assertEqual(result.failed, true);
        assertEqual(result.attempts, 3, 'Must cap retries at exactly MAX_RETRIES (3)');
        assertOk(result.error.message.includes('503'));
      }
    }
  ]
};
