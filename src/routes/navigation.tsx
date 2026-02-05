import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import type { FileRouteTypes } from "@/routeTree.gen";
import { useQuery } from "@tanstack/react-query";

import { getUserQueryOptions, useLogoutMutation } from "@/api/authApi";

type NavigationItem = {
  to: FileRouteTypes["to"];
  name: string;
};

const defaultMenu: NavigationItem[] = [
  {
    to: "/",
    name: "Home",
  },
  {
    to: "/projects",
    name: "Projects",
  },
  {
    to: "/blog",
    name: "Blog",
  },
  {
    to: "/about",
    name: "About",
  },
  {
    to: "/contact",
    name: "Contact",
  },
];

const authMenu: NavigationItem[] = [
  {
    to: "/admin",
    name: "Home",
  },
  {
    to: "/admin/tenant",
    name: "Tenants",
  },
  {
    to: "/admin/bill",
    name: "Bills",
  },
  {
    to: "/admin/property",
    name: "Properties",
  },
];
export const Route = createFileRoute("/navigation")({
  component: Navigation,
});

function Navigation() {
  const {
    isPending: isUserPending,
    error: userError,
    data: userData,
  } = useQuery(getUserQueryOptions);

  const logoutMutation = useLogoutMutation();

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const menu = defaultMenu;

  return (
    <div className="fixed inset-0 bg-background text-foregound w-screen h-screen p-10 flex flex-col items-center justify-center gap-6 overflow-auto">
      <div className="text-center space-y-6">
        <h1 className="text-5xl font-bold">My Website</h1>
        <div className="flex flex-col gap-x-6">
          <nav className="flex flex-col gap-4 text-3xl font-bold">
            {menu.map(({ to, name }) => (
              <Link
                key={to}
                to={to}
                activeProps={{ className: "font-normal underline" }}
                activeOptions={{ exact: to === "/" }}>
                {name}
              </Link>
            ))}

            {isUserPending && <div>Loading...</div>}

            {userError && (
              <>
                <Link to={"/signup"} activeProps={{ className: `font-normal underline` }}>
                  {"Create Account"}
                </Link>
                <Link to={"/login"} activeProps={{ className: `font-normal underline` }}>
                  {"Login"}
                </Link>
              </>
            )}

            {userData && (
              <div className="flex gap-2">
                <button onClick={handleLogout} disabled={logoutMutation.isPending}>
                  Log out
                </button>
                <p> | </p>
                <div>Welcome back, {userData?.firstName}</div>
              </div>
            )}
          </nav>
        </div>
      </div>
    </div>
  );
}
