import { defineWorkersConfig } from "@cloudflare/vitest-pool-workers/config";

export default defineWorkersConfig({
  test: {
    poolOptions: {
      workers: {
        wrangler: { configPath: "./wrangler.jsonc" },
        miniflare: {
          // Pinned so tests do not inherit production values from
          // wrangler.jsonc. Note the worker reads ALLOWED_EMAILS (plural);
          // the previous ALLOWED_EMAIL binding was never read by anything.
          bindings: {
            ENVIRONMENT: "test",
            RP_NAME: "Test App",
            RP_ID: "example.com",
            ORIGIN: "http://example.com",
            ALLOWED_EMAILS: "test@example.com",
            AUTH_METHODS: "passkey,password",
          },
        },
      },
    },
  },
  resolve: {
    alias: {
      tslib: "tslib/tslib.es6.js",
    },
  },
});
