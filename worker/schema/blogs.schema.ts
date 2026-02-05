import { integer, text, sqliteTable } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema, createUpdateSchema } from "drizzle-zod";
import { z } from "zod";
import { ownershipColumns } from "./common";

export const blogMetadata = sqliteTable("blog_metadata", {
  filename: text("filename").primaryKey(),
  title: text("title").notNull(),
  readTime: integer("read_time").notNull(),
  subject: text("subject").notNull(),
  ...ownershipColumns,
});

export const selectBlogMetadataSchema = createSelectSchema(blogMetadata);
export const blogFrontmatterSchema = z.object({
  title: z.string().min(1),
  slug: z.string().optional(),
  summary: z.string().optional(),
  tags: z.array(z.string()).default([]),
  draft: z.boolean().default(false),
  featured: z.boolean().default(false),
  publishedAt: z.iso.datetime().optional(),
  updatedAt: z.iso.datetime().optional(),
  readTime: z.number().optional(),
  subject: z.string().optional(),
});

export const insertBlogMetadataSchema = createInsertSchema(blogMetadata, {
  filename: (s) => s.min(1, "Filename is required").regex(/\.mdx$/, "Must be an .mdx file"),
  title: (s) => s.min(1, "Title cannot be empty"),
  readTime: (s) => s.int().positive("Read time must be a positive number"),
  subject: (s) => s.min(1, "Subject is required"),

  createdAt: z.iso.datetime().optional(),
  updatedAt: z.iso.datetime().optional(),
});

export const updateBlogMetadataSchema = createUpdateSchema(blogMetadata, {
  title: (s) => s.min(1),
  readTime: (s) => s.int().positive(),
  subject: (s) => s.min(1),
  updatedAt: z.iso.datetime().optional(),
}).omit({
  filename: true,
  userId: true,
  createdAt: true,
});

export const apiSelectBlogMetadataSchema = createSelectSchema(blogMetadata).extend({
  authorName: z.string(),
  slug: z.string(),
  summary: z.string().optional(),
  tags: z.array(z.string()).default([]),
  draft: z.boolean().default(false),
  featured: z.boolean().default(false),
  publishedAt: z.iso.datetime().optional(),
});
export const apiBlogPayloadSchema = insertBlogMetadataSchema
  .pick({
    title: true,
    readTime: true,
    subject: true,
  })
  .extend({
    body: z.string().optional(),
  });

export const apiBlogResponseSchema = z.object({
  content: z.string(),
  metadata: selectBlogMetadataSchema
    .pick({
      title: true,
      readTime: true,
      subject: true,
      createdAt: true,
      updatedAt: true,
    })
    .extend({
      authorId: z.string(),
      authorName: z.string(),
      slug: z.string(),
      summary: z.string().optional(),
      tags: z.array(z.string()).default([]),
      draft: z.boolean().default(false),
      featured: z.boolean().default(false),
      publishedAt: z.iso.datetime().optional(),
    }),
});

export type BlogMetadata = z.infer<typeof selectBlogMetadataSchema>;
export type SelectBlogMetadata = z.infer<typeof apiSelectBlogMetadataSchema>;
export type NewBlogMetadata = z.infer<typeof insertBlogMetadataSchema>;
export type UpdateBlogMetadata = z.infer<typeof updateBlogMetadataSchema>;
export type BlogPayload = z.infer<typeof apiBlogPayloadSchema>;
export type BlogResponse = z.infer<typeof apiBlogResponseSchema>;
