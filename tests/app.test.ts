import { describe, it, expect } from "vitest";
import { SELF } from "cloudflare:test";

describe("Hono App - Integration Tests", () => {
  describe("CORS", () => {
    it("should handle OPTIONS preflight requests", async () => {
      const response = await SELF.fetch("http://example.com/api/auth/methods", {
        method: "OPTIONS",
      });

      expect(response.status).toBe(204);
      expect(response.headers.get("Access-Control-Allow-Origin")).toBe("*");
    });
  });

  describe("Base Path", () => {
    it("should route /api/auth requests correctly", async () => {
      const response = await SELF.fetch("http://example.com/api/auth/methods");

      expect(response.status).toBeLessThan(500);
    });

    it("should route /api/blog requests correctly", async () => {
      const response = await SELF.fetch("http://example.com/api/blog/");

      expect(response.status).toBeLessThan(500);
    });
  });

  describe("Asset Handling", () => {
    it("should serve assets for non-API routes", async () => {
      const response = await SELF.fetch("http://example.com/");

      expect(response.status).toBeLessThanOrEqual(404);
    });

    it("should handle 404 routes", async () => {
      const response = await SELF.fetch("http://example.com/some-unknown-route");

      // Should either serve an asset or return 404, but not crash
      expect(response.status).toBeLessThanOrEqual(404);
    });
  });

  describe("HTTP Methods", () => {
    it("should allow GET requests", async () => {
      const response = await SELF.fetch("http://example.com/api/auth/methods", {
        method: "GET",
      });

      expect(response.status).toBeLessThan(500);
    });
  });
});
