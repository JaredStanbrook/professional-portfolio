import { createRootRouteWithContext, Link, Outlet, useNavigate } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClient, useQuery } from "@tanstack/react-query";
import { ModeToggle } from "@/components/mode-toggle";
import { Menu, LogOut, User as UserIcon, X } from "lucide-react";
import { useState } from "react";
import { toast, Toaster } from "sonner";

import "../index.css";
import { Button } from "@/components/ui/button";
import { useLogoutMutation, getUserQueryOptions } from "@/api/authApi";
import type { SafeUser } from "@server/schema/auth.schema";

// --- Configuration ---
type NavigationItem = {
  to: string;
  name: string;
  authRequired?: boolean;
};

const publicMenu: NavigationItem[] = [
  { to: "/", name: "Home" },
  { to: "/projects", name: "Projects" },
  { to: "/blog", name: "Blog" },
  { to: "/about", name: "About" },
  { to: "/contact", name: "Contact" },
];

const authenticatedMenu: NavigationItem[] = [
  { to: "/dashboard", name: "Dashboard", authRequired: true },
  { to: "/profile", name: "Profile", authRequired: true },
];

// 1. UPDATE CONTEXT INTERFACE
interface MyRouterContext {
  queryClient: QueryClient;
  auth: {
    user: SafeUser | null;
    isAuthenticated: boolean;
    isLoading: boolean;
  };
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: Root,
});

/**
 * Sidebar Navigation Component
 */
function SidebarNavigation({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const navigate = useNavigate();
  // Fetch user data for the menu header
  const { data: userData, isPending: isUserPending } = useQuery(getUserQueryOptions);

  const logoutMutation = useLogoutMutation();

  const menuItems = [...publicMenu, ...authenticatedMenu];
  const isAuthenticated = !!userData;

  return (
    <>
      {/* Overlay to close sidebar when clicking outside */}
      {isOpen && (
        <div
          className="fixed inset-0 z-60 bg-black/50 transition-opacity duration-300 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-card shadow-2xl z-60 transform transition-transform duration-300 ease-in-out 
          ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
        {/* Header & Close Button */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">Menu</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Navigation Links */}
        <nav className="p-4 flex flex-col gap-2">
          {menuItems.map(({ to, name, authRequired }) => {
            // Only show auth-required links if authenticated
            if (authRequired && !isAuthenticated) return null;

            return (
              <Link
                key={to}
                to={to}
                onClick={onClose} // Close sidebar when a link is clicked
                className="block px-3 py-2 rounded-lg text-sm font-medium hover:bg-muted transition-colors"
                activeProps={{
                  className: "bg-primary text-primary-foreground hover:bg-primary/90",
                }}>
                {name}
              </Link>
            );
          })}
        </nav>

        {/* User Status & Auth Actions */}
        <div className="absolute bottom-0 w-full p-4 border-t bg-card">
          {isUserPending && (
            <div className="text-sm text-center text-muted-foreground">Loading user...</div>
          )}

          {!isUserPending && isAuthenticated && (
            <div className="flex flex-col gap-2">
              <p className="text-sm font-medium truncate">Welcome, {userData.email}</p>
              <Button
                onClick={() => logoutMutation.mutate()}
                disabled={logoutMutation.isPending}
                variant="destructive">
                <LogOut className="mr-2 h-4 w-4" />
                {logoutMutation.isPending ? "Logging out..." : "Log out"}
              </Button>
            </div>
          )}

          {!isUserPending && !isAuthenticated && (
            <div className="flex flex-col gap-2">
              <Link to="/login" onClick={onClose}>
                <Button className="w-full">
                  <UserIcon className="mr-2 h-4 w-4" />
                  Sign In
                </Button>
              </Link>
              <Link to="/register" onClick={onClose}>
                <Button className="w-full" variant="outline">
                  Create Account
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

/**
 * Root Layout Component
 */
function Root() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { mutate: logout } = useLogoutMutation(); // Keep this for the header button

  return (
    <div className="bg-background leading-relaxed text-foreground antialiased font-sans">
      {/* Sidebar Component */}
      <SidebarNavigation isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      {/* Fixed Header Bar */}
      <div className="fixed flex flex-row gap-2 top-2.5 right-4 lg:w-full lg:flex-row lg:justify-between lg:right-0 lg:px-5 lg:top-4 z-50 pointer-events-none">
        {/* Left: Menu Toggle Button (Now controls local state) */}
        <div className="lg:order-first pointer-events-auto">
          <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(true)}>
            <Menu />
          </Button>
        </div>

        {/* Right: Actions */}
        <div className="lg:order-last pointer-events-auto flex items-center gap-2">
          <AuthButtons logout={logout} />
          <ModeToggle />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="mx-auto flex flex-col min-h-screen max-w-screen-xl px-6 py-12 md:px-12 md:py-20 lg:px-24 lg:py-0">
        <Outlet />
        <Toaster
          position="bottom-right"
          richColors
          theme="light" // or "dark" based on your preference
          toastOptions={{
            className: "font-inter",
          }}
        />
        <TanStackRouterDevtools />
        <ReactQueryDevtools initialIsOpen={false} />
      </div>
    </div>
  );
}

// Simple helper to show Login vs Logout (used in the header bar)
function AuthButtons({ logout }: { logout: () => void }) {
  const { data: userData, isLoading: isUserLoading } = useQuery(getUserQueryOptions);

  if (isUserLoading) return null;

  if (userData) {
    return (
      <Button variant="ghost" size="icon" onClick={() => logout()} title="Logout">
        <LogOut className="h-[1.2rem] w-[1.2rem]" />
      </Button>
    );
  }

  return (
    <Link to="/login">
      <Button variant="ghost" size="icon" title="Login">
        <UserIcon className="h-[1.2rem] w-[1.2rem]" />
      </Button>
    </Link>
  );
}
