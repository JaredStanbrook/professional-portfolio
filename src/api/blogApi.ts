// src/api/blogApi.ts
import { queryOptions, useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { toast } from "sonner";
import { api } from "@/api/apiClient";
import { getErrorMessage } from "@/lib/utils";
import {
  type SelectBlogMetadata,
  apiBlogResponseSchema,
  apiSelectBlogMetadataSchema,
} from "@server/schema/blogs.schema";

export const blogKeys = {
  all: ["blogs"] as const,
  lists: () => [...blogKeys.all, "list"] as const,
  detail: (filename: string) => [...blogKeys.all, "detail", filename] as const,
};

export const blog = api.blog;

type BlogListResponse = {
  blogs?: unknown;
};
type PutBlogResponse = {
  ok: boolean;
  filename: string;
  metadata: SelectBlogMetadata;
};

const getToastMessage = (err: unknown) =>
  err instanceof Error ? err.message : "An unexpected error occurred";

async function readJson<T>(res: Response): Promise<T> {
  return (await res.json()) as T;
}

export async function getAllBlogs() {
  const res = await blog.$get();

  if (!res.ok) throw new Error("Failed to fetch blogs");

  const data = await readJson<BlogListResponse>(res);

  // Runtime Validation: Ensure backend sends what we expect
  const result = z.array(apiSelectBlogMetadataSchema).safeParse(data.blogs);
  if (!result.success) {
    console.error("API Contract Violation:", result.error);
    throw new Error("Invalid data received from server");
  }

  return result.data;
}

export const getAllBlogsQueryOptions = queryOptions({
  queryKey: blogKeys.lists(),
  queryFn: getAllBlogs,
  staleTime: 1000 * 60 * 5, // 5 minutes
});

export async function getBlogContent(filename: string) {
  // Access the route with the regex pattern defined in Hono
  const res = await blog[`:filename{.+\\.mdx}`].$get({
    param: { filename },
  });

  if (!res.ok) {
    if (res.status === 404) return null; // Handle 404 gracefully
    throw new Error("Failed to load blog post");
  }

  const data = await readJson<unknown>(res);

  // Runtime Validation
  const result = apiBlogResponseSchema.safeParse(data);
  if (!result.success) {
    console.error("API Contract Violation:", result.error);
    throw new Error("Invalid blog post data");
  }

  return result.data;
}

export const getBlogContentQueryOptions = (filename: string) =>
  queryOptions({
    queryKey: blogKeys.detail(filename),
    queryFn: () => getBlogContent(filename),
    enabled: !!filename,
    retry: (failureCount, error) => {
      // Don't retry if it's a 404
      if (error instanceof Error && error.message.includes("404")) return false;
      return failureCount < 3;
    },
  });

export async function putBlogContent({ filename, content }: { filename: string; content: string }) {
  const res = await blog[`:filename{.+\\.mdx}`].$put({
    param: { filename },
    json: { body: content },
  });
  if (!res.ok) throw new Error(await getErrorMessage(res));
  return await readJson<PutBlogResponse>(res);
}

export async function deleteBlogContent(filename: string) {
  const res = await blog[`:filename{.+\\.mdx}`].$delete({
    param: { filename },
  });

  if (!res.ok) throw new Error(await getErrorMessage(res));
  return await readJson<unknown>(res);
}

export function usePutBlogMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: putBlogContent,
    onSuccess: (data) => {
      toast.success("Blog saved successfully");

      // 1. Instant Detail Update: Update the specific blog cache
      // We reconstruct the full object assuming the body content we just sent is valid
      // Note: In a real app, you might want the backend to return the full content or refetch.
      queryClient.setQueryData(blogKeys.detail(data.filename), () => {
        // We can't fully reconstruct 'content' here without passing it from variables,
        // so we usually invalidate to be safe, OR we update just metadata if the UI supports it.
        // For now, let's invalidate to ensure we get the fresh DB timestamps and sanitized content.
        return undefined;
      });

      // 2. Refresh the list to show new title/timestamps
      void queryClient.invalidateQueries({ queryKey: blogKeys.lists() });

      // 3. Force refetch of the specific item
      void queryClient.invalidateQueries({ queryKey: blogKeys.detail(data.filename) });
    },
    onError: (err: unknown) => toast.error(getToastMessage(err)),
  });
}

export function useDeleteBlogMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteBlogContent,
    onSuccess: (_data, filename) => {
      toast.info("Blog deleted");

      // 1. Optimistic List Update: Remove item from list immediately
      queryClient.setQueryData(blogKeys.lists(), (old: SelectBlogMetadata[] | undefined) => {
        return old ? old.filter((b) => b.filename !== filename) : [];
      });

      // 2. Remove the specific detail cache entirely
      queryClient.removeQueries({ queryKey: blogKeys.detail(filename) });
    },
    onError: (err: unknown) => toast.error(getToastMessage(err)),
  });
}
