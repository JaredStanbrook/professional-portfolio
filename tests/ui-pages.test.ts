import { describe, it, expect } from "vitest";
import { Hono } from "hono";

import app from "../worker/app";
import type { AppEnv } from "../worker/types";
import type { AppConfig } from "../worker/config/app.config";
import type { AuthConfig } from "../worker/config/auth.config";
import { createFakeDb, createMockData } from "./utils/fakeDb";

/**
 * Smoke tests: every route renders without throwing, signed out and signed in.
 *
 * They exist to catch the failure this template makes easy — a view importing
 * something a route no longer provides. They are not a substitute for testing
 * your own feature logic.
 */

const createAppConfig = (): AppConfig => ({
  name: "Test App",
  tagline: "Testing",
  locale: "en-AU",
  currency: "AUD",
  timezone: "UTC",
  origin: "http://localhost:3000",
});

const createAuthConfig = (methods: string[] = ["password"]): AuthConfig => ({
  methods: new Set(methods as any),
  session: { duration: 1000, renewalThreshold: 500, maxSessions: 5 },
  security: {
    maxFailedAttempts: 5,
    lockoutDuration: 300,
    requireEmailVerification: false,
    requirePhoneVerification: false,
    allowedEmails: [],
    jwtSecret: "test",
    jwtExpiry: 3600,
    hashIterations: 1000,
  },
  roles: {
    available: ["user", "admin"],
    default: "user",
    restricted: ["admin"],
    inherent: {},
  },
  permissions: { available: [] },
  password: {
    minLength: 8,
    requireUppercase: false,
    requireLowercase: false,
    requireNumbers: false,
    requireSpecialChars: false,
  },
});

/**
 * `methods` is worth varying: the auth pages hide their tab strip entirely
 * when only one method is enabled, so a single-method config never renders
 * roughly half of those screens.
 */
const createTestApp = (user: any | null, methods?: string[], registrationOpen = true) => {
  const fakeDb = createFakeDb(createMockData());

  const wrapper = new Hono<AppEnv>();
  wrapper.use("*", async (c, next) => {
    c.set("db", fakeDb as any);
    c.set("app", createAppConfig());
    c.set("authConfig", createAuthConfig(methods));
    c.set("auth", {
      user,
      session: user ? { id: user.id } : null,
      destroySession() {},
      isRegistrationOpen: async () => registrationOpen,
    } as any);
    c.set("isMethodEnabled", () => true);
    await next();
  });

  wrapper.route("/", app);
  return wrapper;
};

/** R2 stand-in: every key holds the same small post. */
const fakeR2 = {
  get: async () => ({
    text: async () =>
      '---\ntitle: "First post"\nreadTime: 3\nsubject: "Web"\n---\n# Hello\n\nSome **bold** text.',
  }),
};

const env = {
  KV: {},
  DB: {},
  ASSETS: {},
  R2: fakeR2,
  APP_NAME: "Test App",
  ORIGIN: "http://localhost:3000",
} as any;

const get = (testApp: Hono<AppEnv>, path: string) =>
  testApp.fetch(new Request(`http://localhost${path}`), env);

describe("UI pages load", () => {
  it("serves public pages to signed-out visitors", async () => {
    const testApp = createTestApp(null);

    for (const path of [
      "/",
      "/blog",
      "/it-help-desk",
      "/grade-calculator",
      "/blog/first-post",
      "/login",
      "/register",
    ]) {
      const res = await get(testApp, path);
      expect(res.status, `GET ${path}`).toBe(200);
    }
  });

  it("closes /register and hides its link once sign-up is closed", async () => {
    const closed = createTestApp(null, undefined, false);

    const res = await get(closed, "/register");
    expect(res.status).toBe(302);
    expect(res.headers.get("location")).toBe("/login");

    // The sign-in card stops offering it.
    const login = await (await get(closed, "/login")).text();
    expect(login).not.toContain("have an account?");

    // Open by default: the prompt is there on an ordinary site.
    const open = await (await get(createTestApp(null), "/login")).text();
    expect(open).toContain("have an account?");
  });

  it("does not offer a restricted role on the sign-up form", async () => {
    const html = await (await get(createTestApp(null), "/register")).text();
    expect(html).not.toMatch(/<option[^>]*value="admin"/);
  });

  it("redirects signed-out visitors away from protected pages", async () => {
    const testApp = createTestApp(null);

    for (const path of [
      "/profile",
      "/editor",
      "/editor/new",
      "/editor/first-post",
      "/admin/logs",
      "/admin/resumes",
      "/admin/resumes/automation",
    ]) {
      const res = await get(testApp, path);
      expect(res.status, `GET ${path}`).toBe(302);
      expect(res.headers.get("location"), `GET ${path}`).toBe("/login");
    }
  });

  it("serves protected pages to a signed-in admin", async () => {
    const testApp = createTestApp(createMockData().users[0]);

    for (const path of [
      "/",
      "/blog/first-post",
      "/profile",
      "/editor",
      "/editor/new",
      "/editor/first-post",
      "/admin/logs",
      "/admin/resumes",
      "/admin/resumes/automation",
    ]) {
      const res = await get(testApp, path);
      expect(res.status, `GET ${path}`).toBe(200);
    }
  });

  it("puts the phone number on admin résumés only, never the public one", async () => {
    const admin = createTestApp(createMockData().users[0]);
    const withPhone = { ...env, RESUME_PHONE: "(+61) 400 111 222" };
    const fetchWith = (path: string) =>
      admin.fetch(new Request(`http://localhost${path}`), withPhone);

    expect(await (await fetchWith("/admin/resumes/automation")).text()).toContain("400 111 222");
    expect(await (await fetchWith("/resume")).text()).not.toContain("400 111 222");
    expect((await fetchWith("/admin/resumes/no-such-job")).status).toBe(404);
  });

  it("renders a post's Markdown and dates it in UTC", async () => {
    const html = await (await get(createTestApp(null), "/blog/first-post")).text();
    expect(html).toContain("<strong>bold</strong>");
    expect(html).toContain("1 Mar 2025");
    // Signed out: no edit button.
    expect(html).not.toContain('href="/editor/first-post"');
  });

  it("offers the author an edit link on their post", async () => {
    const html = await (
      await get(createTestApp(createMockData().users[0]), "/blog/first-post")
    ).text();
    expect(html).toContain('href="/editor/first-post"');
  });

  it("renders the résumé as its own document, kept out of search", async () => {
    const res = await get(createTestApp(null), "/resume");
    const html = await res.text();
    expect(res.status).toBe(200);
    expect(res.headers.get("x-robots-tag")).toBe("noindex");
    expect(html.startsWith("<!doctype html>")).toBe(true);
    expect(html).toContain("Help Desk Technician");
    expect(html).toContain('href="/resume.pdf"');
    // A document, not a site page: no nav, no theme.
    expect(html).not.toContain("float-nav");
  });

  it("sends the old about page to the portfolio on the home page", async () => {
    const res = await get(createTestApp(null), "/about");
    expect(res.status).toBe(301);
    expect(res.headers.get("location")).toBe("/");
  });

  it("rejects a malformed post address without reaching storage", async () => {
    const res = await get(createTestApp(null), "/blog/..%2Fsecret");
    expect(res.status).toBe(404);
  });

  it("recalculates the grade calculator from a posted form", async () => {
    const res = await createTestApp(null).fetch(
      new Request("http://localhost/grade-calculator", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: "mark=80&weight=50&mark=&weight=50&expected=70&add=1",
      }),
      env,
    );
    const html = await res.text();
    expect(res.status).toBe(200);
    expect(html).toContain("You need an average of 60.00%");
    // add=1 appended a third row.
    expect(html.match(/name="weight"/g)?.length).toBe(3);
  });

  /**
   * `class="grid-cols-${n}"` in a plain JSX attribute is not interpolation —
   * it is the literal text, emitted straight into the markup. Tailwind builds
   * classes by scanning source for complete names, so it never makes that one
   * and the rule silently does nothing. Both auth pages shipped this way and
   * their tab strips stacked vertically instead of sitting in a row.
   *
   * The same text inside a Lit `html` template is real interpolation and is
   * fine, which is why this checks the rendered output rather than the source:
   * a `${...}` reaching the browser is unambiguous, wherever it came from.
   *
   * Write the whole class name, or map a value to complete names — see
   * `gridColsFor` in worker/views/pages/authParts.tsx.
   */
  it("renders no unevaluated template interpolation", async () => {
    const signedOut = createTestApp(null);
    const signedIn = createTestApp(createMockData().users[0]);
    // The tab strip — where this bug lives — only exists with >1 method.
    const multiMethod = createTestApp(null, ["password", "pin", "passkey"]);

    const pages: [Hono<AppEnv>, string][] = [
      [signedOut, "/"],
      [signedOut, "/login"],
      [signedOut, "/register"],
      [multiMethod, "/login"],
      [multiMethod, "/register"],
      [signedIn, "/profile"],
      [signedOut, "/blog"],
      [signedOut, "/it-help-desk"],
      [signedOut, "/grade-calculator"],
      [signedOut, "/blog/first-post"],
      [signedIn, "/editor"],
      [signedIn, "/editor/new"],
      [signedIn, "/editor/first-post"],
      [signedIn, "/admin/logs"],
      [signedIn, "/admin/resumes"],
      [signedIn, "/admin/resumes/automation"],
    ];

    for (const [testApp, path] of pages) {
      const html = await (await get(testApp, path)).text();
      const leaked = html.match(/\$\{[^}]{0,60}\}/g) ?? [];
      expect(leaked, `GET ${path} leaked an uninterpolated expression`).toEqual([]);
    }
  });

  /**
   * Not every auth method is a tab. `totp` is a second step after a successful
   * sign-in, never a choice on this screen — so "password,passkey,totp" draws
   * two tabs, and "password,totp" draws one, which is no choice at all.
   *
   * Sizing the strip by the number of enabled methods therefore left an empty
   * column, and showed a one-tab strip. Count what renders.
   */
  it("sizes the auth tab strip by the tabs it actually renders", async () => {
    const tabsFor = async (methods: string[], path: string) => {
      const html = await (await get(createTestApp(null, methods), path)).text();
      const strip = html.match(/<div[^>]*slot="tabs"[^>]*>/)?.[0];
      return { strip, tabs: (html.match(/data-tab="/g) ?? []).length };
    };

    for (const path of ["/login", "/register"]) {
      const three = await tabsFor(["password", "pin", "passkey"], path);
      expect(three.tabs, `${path} with three tabs`).toBe(3);
      expect(three.strip, `${path} with three tabs`).toContain("grid-cols-3");

      // totp is enabled but is not a tab, so this is a two-tab strip.
      const two = await tabsFor(["password", "passkey", "totp"], path);
      expect(two.tabs, `${path} with totp enabled`).toBe(2);
      expect(two.strip, `${path} with totp enabled`).toContain("grid-cols-2");

      // One real choice is no choice — no strip at all.
      const one = await tabsFor(["password", "totp"], path);
      expect(one.tabs, `${path} with one real method`).toBe(0);
      expect(one.strip, `${path} with one real method`).toBeUndefined();
    }
  });

  it("returns a bare fragment for the editor's live preview", async () => {
    const testApp = createTestApp(createMockData().users[0]);

    const res = await testApp.fetch(
      new Request("http://localhost/editor/preview", {
        method: "POST",
        headers: { "HX-Request": "true", "Content-Type": "application/x-www-form-urlencoded" },
        body: "body=%23+Title",
      }),
      env,
    );
    const html = await res.text();

    expect(res.status).toBe(200);
    expect(html).toContain("<h1>Title</h1>");
    expect(html).not.toContain("<!DOCTYPE html>");
  });
});
