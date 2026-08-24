import { describe, it, expect } from "vitest";
import { env, SELF } from "cloudflare:test";
import { getTestEmails } from "../helpers";

const BASE = "http://example.com";
const REGISTER_OPTIONS_URL = `${BASE}/api/auth/passkey/register/options`;
const LOGOUT_URL = `${BASE}/api/auth/logout`;

// The auth router is wrapped in hono's csrf() middleware, so every
// state-changing request needs an Origin the worker accepts.
const ALLOWED_ORIGIN = "http://localhost";
const JSON_HEADERS = { "Content-Type": "application/json", Origin: ALLOWED_ORIGIN };

const INVITE_ONLY_ERROR = "Registration is currently invite-only.";

function postRegisterOptions(body: unknown) {
  return SELF.fetch(REGISTER_OPTIONS_URL, {
    method: "POST",
    headers: JSON_HEADERS,
    body: JSON.stringify(body),
  });
}

describe("Auth Routes", () => {
  describe("GET /api/auth/methods", () => {
    it("should report the configured auth methods", async () => {
      const response = await SELF.fetch(`${BASE}/api/auth/methods`);

      expect(response.status).toBe(200);
      const data = (await response.json()) as { methods: string[]; defaultRole: string };
      expect(data.methods).toEqual(expect.arrayContaining(["passkey", "password"]));
      expect(data.defaultRole).toBe("user");
    });

    it("should not expose restricted roles", async () => {
      const response = await SELF.fetch(`${BASE}/api/auth/methods`);

      const data = (await response.json()) as { roles: string[] };
      expect(data.roles).toContain("user");
      expect(data.roles).not.toContain("admin");
    });
  });

  describe("CSRF protection", () => {
    it("should reject a state-changing request with no Origin", async () => {
      const response = await SELF.fetch(LOGOUT_URL, { method: "POST" });

      expect(response.status).toBe(403);
    });

    it("should reject a state-changing request from a foreign Origin", async () => {
      const response = await SELF.fetch(LOGOUT_URL, {
        method: "POST",
        headers: { Origin: "https://evil.example" },
      });

      expect(response.status).toBe(403);
    });

    // Regression: the origin pattern used to be an unanchored alternation, so
    // any origin merely starting with http://localhost was trusted.
    it.each([
      "http://localhost.attacker.example",
      "http://localhost.evil.com",
      "http://localhostx",
    ])("should reject the lookalike origin %s", async (origin) => {
      const response = await SELF.fetch(LOGOUT_URL, { method: "POST", headers: { Origin: origin } });

      expect(response.status).toBe(403);
    });

    it("should accept localhost with a dev port", async () => {
      const response = await SELF.fetch(LOGOUT_URL, {
        method: "POST",
        headers: { Origin: "http://localhost:5173" },
      });

      expect(response.status).toBe(200);
    });

    it("should accept the origin configured for this deployment", async () => {
      const response = await SELF.fetch(LOGOUT_URL, {
        method: "POST",
        headers: { Origin: env.ORIGIN },
      });

      expect(response.status).toBe(200);
    });
  });

  describe("POST /api/auth/passkey/register/options", () => {
    it("should reject a missing email", async () => {
      const response = await postRegisterOptions({});

      expect(response.status).toBe(400);
      const data = (await response.json()) as { success: boolean; error: { name: string } };
      expect(data.success).toBe(false);
      expect(data.error.name).toBe("ZodError");
    });

    it("should reject an email that is not on the invite list", async () => {
      const response = await postRegisterOptions({ email: getTestEmails().disallowed });

      expect(response.status).toBe(400);
      const data = (await response.json()) as { error: string };
      expect(data.error).toBe(INVITE_ONLY_ERROR);
    });

    // The invited-email cases stop at the invite gate: going further would hit
    // the users table, which the test D1 has no migrations for.
    it("should let an invited email past the invite gate", async () => {
      const response = await postRegisterOptions({ email: getTestEmails().allowed });

      const data = (await response.json()) as { error?: string };
      expect(data.error).not.toBe(INVITE_ONLY_ERROR);
    });

    it("should match the invite list case-insensitively", async () => {
      const response = await postRegisterOptions({ email: getTestEmails().allowedUppercase });

      const data = (await response.json()) as { error?: string };
      expect(data.error).not.toBe(INVITE_ONLY_ERROR);
    });
  });

  describe("GET /api/auth/me", () => {
    it("should return 401 when not authenticated", async () => {
      const response = await SELF.fetch(`${BASE}/api/auth/me`);

      expect(response.status).toBe(401);
      const data = (await response.json()) as { error: string };
      expect(data.error).toBe("You are not logged in.");
    });
  });

  describe("POST /api/auth/logout", () => {
    it("should return success for an allowed Origin", async () => {
      const response = await SELF.fetch(LOGOUT_URL, {
        method: "POST",
        headers: { Origin: ALLOWED_ORIGIN },
      });

      expect(response.status).toBe(200);
      const data = (await response.json()) as { success: boolean };
      expect(data.success).toBe(true);
    });
  });

  describe("Environment Configuration", () => {
    it("should have correct environment variables from wrangler config", () => {
      expect(env.ENVIRONMENT).toBeDefined();
      expect(env.RP_NAME).toBeDefined();
      expect(env.RP_ID).toBeDefined();
      expect(env.ORIGIN).toBeDefined();
      expect(env.ALLOWED_EMAILS).toBeDefined();
    });

    it("should have working bindings", () => {
      expect(env.DB).toBeDefined();
      expect(env.KV).toBeDefined();
      expect(env.BLOG).toBeDefined();
      expect(env.RATE_LIMITER).toBeDefined();
    });
  });
});
