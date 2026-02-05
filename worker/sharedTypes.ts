import { insertUserSchema, insertSessionSchema } from "./schema/auth.schema";
import { z } from "zod";
import { selectGithubCacheSchema } from "./schema/githubCache";
import { selectBlogMetadataSchema } from "./schema/blogs.schema";

export const createUserSchema = insertUserSchema
  .omit({
    id: true,
    emailVerified: true,
    phoneNumber: true,
  })
  .extend({
    address: z.string().optional(),
  });

export const authUserSchema = insertUserSchema.omit({
  id: true,
  passwordHash: true,
  emailVerified: true,
  phoneNumber: true,
});

export const createSessionSchema = insertSessionSchema.omit({
  id: true,
});

export type CreateUser = z.infer<typeof createUserSchema>;
export type AuthUser = z.infer<typeof authUserSchema>;
export type CreateSession = z.infer<typeof createSessionSchema>;
export type GithubCache = z.infer<typeof selectGithubCacheSchema>;
export type BlogMetadata = z.infer<typeof selectBlogMetadataSchema>;
