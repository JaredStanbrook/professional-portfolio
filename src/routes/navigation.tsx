import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import type { FileRouteTypes } from "@/routeTree.gen";
import { useQuery } from "@tanstack/react-query";
import { BookOpen, FolderGit2, Home, Info, Mail } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { getUserQueryOptions, useLogoutMutation } from "@/api/authApi";

type NavigationItem = {
  to: FileRouteTypes["to"];
  name: string;
  icon: LucideIcon;
};

const defaultMenu: NavigationItem[] = [
  {
    to: "/",
    name: "Home",
    icon: Home,
  },
  {
    to: "/projects",
    name: "Projects",
    icon: FolderGit2,
  },
  {
    to: "/blog",
    name: "Blog",
    icon: BookOpen,
  },
  {
    to: "/about",
    name: "About",
    icon: Info,
  },
  {
    to: "/contact",
    name: "Contact",
    icon: Mail,
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
            {menu.map(({ to, name, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                activeProps={{ className: "font-normal underline" }}
                activeOptions={{ exact: to === "/" }}>
                <span className="inline-flex items-center gap-3">
                  <Icon className="h-6 w-6" />
                  {name}
                </span>
              </Link>
            ))}

            {isUserPending && <div>Loading...</div>}

            {userError && (
              <>
                <Link to={"/register"} activeProps={{ className: `font-normal underline` }}>
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
                <div>Welcome back, {userData?.displayName ?? userData?.username ?? "friend"}</div>
              </div>
            )}
          </nav>
        </div>
      </div>
    </div>
  );
}
