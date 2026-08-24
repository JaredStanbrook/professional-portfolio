import { env } from "cloudflare:test";

/**
 * Helper to create test data for users
 */
export function createTestUser(overrides?: Partial<{ id: string; email: string }>) {
  return {
    id: overrides?.id || crypto.randomUUID(),
    email: overrides?.email || "test@example.com",
  };
}

/**
 * Helper to create test authenticator data
 */
export function createTestAuthenticator(userId: string) {
  return {
    id: crypto.randomUUID(),
    userId,
    credentialId: crypto.randomUUID(),
    credentialPublicKey: "mock-public-key",
    counter: 0,
    transports: JSON.stringify(["internal"]),
  };
}

/**
 * Helper to get allowed email from environment
 */
export function getAllowedEmail(): string {
  return env.ALLOWED_EMAILS;
}

/**
 * Helper to create various test email scenarios
 */
export function getTestEmails() {
  return {
    allowed: env.ALLOWED_EMAILS,
    allowedUppercase: env.ALLOWED_EMAILS.toUpperCase(),
    disallowed: "notallowed@example.com",
    invalid: "not-an-email",
    empty: "",
  };
}
