// src/routes/_authenticated.tsx
import { getUserQueryOptions, logoutUser } from "@/api/authApi";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: async ({ context, location }) => {
    const queryClient = context.queryClient;
    try {
      await queryClient.ensureQueryData(getUserQueryOptions);
    } catch {
      queryClient.removeQueries(getUserQueryOptions);
      await logoutUser();
      throw redirect({
        to: "/login",
        search: { redirect: location.href },
      });
    }
  },
  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
  useSuspenseQuery(getUserQueryOptions);
  return <Outlet />;
}
