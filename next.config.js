// next.config.js
/**
 * Next.js configuration with security headers.
 * Adds a strict Content‑Security‑Policy (CSP) header to all routes.
 * Adjust the directives as needed for external resources.
 */
const csp = process.env.NODE_ENV === 'production'
  ? "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self' https://*.supabase.co;"
  : "default-src 'self' 'unsafe-inline' 'unsafe-eval' data:; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self' https://*.supabase.co;"

module.exports = {
  async headers() {
    if (process.env.NODE_ENV === 'production') {
      return [
        {
          source: '/(.*)',
          headers: [
            { key: 'Content-Security-Policy', value: csp },
            { key: 'X-Content-Type-Options', value: 'nosniff' },
            { key: 'X-Frame-Options', value: 'DENY' },
            { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          ],
        },
      ];
    }
    // In development, no CSP header to avoid blocking HMR/WebSocket
    return [];
  },
  // Enable strict mode and future Webpack optimizations
  reactStrictMode: true,
  // swcMinify removed – Next.js 16+ uses SWC by default
};
