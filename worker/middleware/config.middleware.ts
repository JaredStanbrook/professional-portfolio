import { createMiddleware } from "hono/factory";
import type { Bindings, Variables } from "../types";
import { parseAuthConfig, type AuthMethod } from "../config/auth.config";

export const configMiddleware = createMiddleware<{
  Bindings: Bindings;
  Variables: Variables;
}>(async (c, next) => {
  const authConfig = parseAuthConfig(c.env);
  c.set("authConfig", authConfig);
  c.set("isMethodEnabled", (method: string) => authConfig.methods.has(method as AuthMethod));
  await next();
});
