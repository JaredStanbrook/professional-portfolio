import { html, raw } from "hono/html";
import { PropsUser } from "@server/schema/auth.schema";

// --- CONFIGURATION ---
/**
 * Nav items per role. Everyone sees `default`; a signed-in user also sees the
 * union of the lists for every role they hold, de-duplicated by href.
 *
 * The menu is icons only, so every entry needs an icon that says what it is
 * on its own (registered in worker/components/lib/icons.ts) and a name, which
 * becomes the accessible label and the hover caption.
 */
type NavItem = { to: string; name: string; icon: string };

const menuConfig: Record<string, NavItem[]> = {
  default: [
    { to: "/", name: "Blog", icon: "book-open" },
    { to: "/about", name: "About me", icon: "user" },
    { to: "/grade-calculator", name: "Grade calculator", icon: "calculator" },
  ],
  user: [{ to: "/editor", name: "Write", icon: "notebook-pen" }],
  editor: [{ to: "/editor", name: "Write", icon: "notebook-pen" }],
  admin: [
    { to: "/editor", name: "Write", icon: "notebook-pen" },
    { to: "/admin/access", name: "Access links", icon: "link" },
    { to: "/admin/logs", name: "System logs", icon: "scroll-text" },
  ],
};

const getMenuItems = (user: PropsUser | null | undefined) => {
  const items: NavItem[] = [];
  const seen = new Set<string>();

  for (const role of ["default", ...(user?.roles ?? [])]) {
    for (const item of menuConfig[role] ?? []) {
      if (seen.has(item.to)) continue;
      seen.add(item.to);
      items.push(item);
    }
  }
  return items;
};

// --- STYLES ---
// Every bubble — the launcher and each item — is the same frosted circle.
const bubble =
  "flex h-14 w-14 items-center justify-center rounded-full border border-border/60 bg-background/60 text-foreground shadow-lg backdrop-blur-md transition-colors hover:bg-accent/80 hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

/**
 * The caption under an item. When it shows is in `.float-nav-caption`
 * (worker/index.css): on hover and keyboard focus, and always on a touch
 * screen, where there is no hover to reveal it.
 */
const caption =
  "float-nav-caption pointer-events-none absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap rounded-md bg-popover px-2 py-1 text-xs font-medium text-popover-foreground shadow-sm";

// --- MAIN NAVBAR ---

interface NavBarProps {
  appName: string;
  user?: PropsUser | null;
  currentPath?: string;
}

/**
 * The whole nav: one frosted circle fixed in the top-right corner. Pressing
 * it blurs the page and blobs the items out of it one at a time; they drift
 * about the screen until one is picked, the backdrop is clicked, Escape is
 * pressed, or the circle is pressed again.
 *
 * The motion is CSS (`.float-nav*` in worker/index.css); the inline script
 * only picks where each item lands and flips `data-open`.
 */
export const NavBar = ({ appName, user, currentPath }: NavBarProps) => {
  const isActive = (to: string) =>
    to === "/"
      ? currentPath === "/" || !!currentPath?.startsWith("/blog/")
      : !!currentPath?.startsWith(to);

  const item = (content: unknown, label: string) => html`
    <li class="float-nav-item group" style="--i:0">
      <div class="float-nav-drift">${content}</div>
      <span class="${caption}">${label}</span>
    </li>
  `;

  return html`
    <div id="float-nav" class="float-nav" data-open="false">
      <div
        class="float-nav-backdrop fixed inset-0 z-[90] bg-background/40 backdrop-blur-sm"
        aria-hidden="true"
      ></div>

      <button
        id="float-nav-toggle"
        type="button"
        class="${bubble} fixed right-4 top-4 z-[110]"
        aria-expanded="false"
        aria-controls="float-nav-menu"
        aria-label="Open menu"
      >
        <i data-lucide="menu" class="float-nav-icon-open h-6 w-6" aria-hidden="true"></i>
        <i data-lucide="x" class="float-nav-icon-close hidden h-6 w-6" aria-hidden="true"></i>
      </button>

      <nav id="float-nav-menu" aria-label="${appName}" class="float-nav-menu">
        <ul class="contents">
          ${getMenuItems(user).map((it) =>
            item(
              html`<a
                href="${it.to}"
                class="${bubble} no-underline ${isActive(it.to) ? "ring-2 ring-primary" : ""}"
                aria-label="${it.name}"
                ${isActive(it.to) ? raw('aria-current="page"') : ""}
              >
                <i data-lucide="${it.icon}" class="h-6 w-6" aria-hidden="true"></i>
              </a>`,
              it.name,
            ),
          )}
          ${
            user
              ? item(
                  html`<a href="/profile" class="${bubble} no-underline" aria-label="Profile">
                    <i data-lucide="circle-user" class="h-6 w-6" aria-hidden="true"></i>
                  </a>`,
                  "Profile",
                )
              : ""
          }
          ${item(
            html`<button type="button" class="${bubble} float-nav-theme" aria-label="Change theme">
              <i
                data-theme-icon="light"
                data-lucide="sun"
                class="hidden h-6 w-6"
                aria-hidden="true"
              ></i>
              <i
                data-theme-icon="dark"
                data-lucide="moon"
                class="hidden h-6 w-6"
                aria-hidden="true"
              ></i>
              <i
                data-theme-icon="system"
                data-lucide="laptop"
                class="h-6 w-6"
                aria-hidden="true"
              ></i>
            </button>`,
            "Theme",
          )}
          ${
            user
              ? item(
                  html`<button
                    type="button"
                    hx-post="/web/auth/logout"
                    class="${bubble} text-destructive hover:bg-destructive/15 hover:text-destructive"
                    aria-label="Log out"
                  >
                    <i data-lucide="log-out" class="h-6 w-6" aria-hidden="true"></i>
                  </button>`,
                  "Log out",
                )
              : ""
          }
        </ul>
      </nav>
    </div>

    ${floatNavScript}
  `;
};

/**
 * Open/close, scatter, and the theme cycle.
 *
 * A boosted navigation swaps <body>, which re-runs this script against fresh
 * markup. The document-level listeners are added once; everything else looks
 * the elements up when it needs them, so it always acts on the current page.
 */
const floatNavScript = raw(`<script>
(function () {
  var THEMES = ["light", "dark", "system"];
  var KEY = "vite-ui-theme";
  var root = document.documentElement;

  function el(id) { return document.getElementById(id); }
  function nav() { return el("float-nav"); }
  function items() { return Array.prototype.slice.call(document.querySelectorAll("#float-nav .float-nav-item")); }
  function rand(a, b) { return a + Math.random() * (b - a); }

  // --- theme ---
  function theme() { var t = localStorage.getItem(KEY) || "system"; return THEMES.indexOf(t) < 0 ? "system" : t; }
  function applyTheme(t) {
    root.classList.remove("light", "dark", "system");
    if (t === "system") root.classList.toggle("dark", matchMedia("(prefers-color-scheme: dark)").matches);
    else root.classList.add(t);
    document.querySelectorAll("#float-nav [data-theme-icon]").forEach(function (i) {
      i.classList.toggle("hidden", i.getAttribute("data-theme-icon") !== t);
    });
    var btn = document.querySelector("#float-nav .float-nav-theme");
    if (btn) btn.setAttribute("aria-label", "Theme: " + t + ". Change theme");
  }

  /**
   * Spread the items over the viewport: evenly round an ellipse, then
   * jittered, so they look scattered but never stack. Each gets its own
   * drift speed and phase so they do not bob in step.
   */
  function scatter() {
    var list = items(), n = list.length;
    var w = innerWidth, h = innerHeight, size = 56, pad = 24;
    var cx = w / 2, cy = h / 2;
    var rx = Math.max(70, Math.min(w / 2 - size - pad, 360));
    var ry = Math.max(90, Math.min(h / 2 - size - pad, 280));
    var start = rand(0, Math.PI * 2);
    var btn = el("float-nav-toggle").getBoundingClientRect();
    var ox = btn.left + btn.width / 2, oy = btn.top + btn.height / 2;
    list.forEach(function (li, i) {
      var a = start + (i / n) * Math.PI * 2 + rand(-0.25, 0.25);
      var r = rand(0.7, 1);
      var x = cx + Math.cos(a) * rx * r - size / 2;
      var y = cy + Math.sin(a) * ry * r - size / 2;
      x = Math.min(Math.max(pad, x), w - size - pad);
      y = Math.min(Math.max(pad + 64, y), h - size - pad - 24);
      li.style.setProperty("--i", i);
      li.style.setProperty("--n", n);
      li.style.setProperty("--from-x", ox - size / 2 + "px");
      li.style.setProperty("--from-y", oy - size / 2 + "px");
      li.style.setProperty("--x", x + "px");
      li.style.setProperty("--y", y + "px");
      li.style.setProperty("--dx", rand(-22, 22).toFixed(1) + "px");
      li.style.setProperty("--dy", rand(-18, 18).toFixed(1) + "px");
      li.style.setProperty("--drift", rand(5, 9).toFixed(2) + "s");
      li.style.setProperty("--phase", rand(-9, 0).toFixed(2) + "s");
    });
  }

  function setOpen(open) {
    var n = nav(), btn = el("float-nav-toggle");
    if (!n || !btn) return;
    // Place first and flush, so the items start from the button rather than
    // animating in from wherever their previous position variables left them.
    if (open) { scatter(); void n.offsetWidth; }
    n.dataset.open = String(open);
    btn.setAttribute("aria-expanded", String(open));
    btn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    btn.querySelector(".float-nav-icon-open").classList.toggle("hidden", open);
    btn.querySelector(".float-nav-icon-close").classList.toggle("hidden", !open);
    if (open) {
      var first = n.querySelector(".float-nav-item a, .float-nav-item button");
      if (first) setTimeout(function () { first.focus({ preventScroll: true }); }, 120);
    }
  }

  // Fresh markup from a swap: show the right theme icon, start closed.
  applyTheme(theme());
  if (window.renderIcons) window.renderIcons();

  if (window.__floatNavInit) return;
  window.__floatNavInit = true;

  document.addEventListener("click", function (e) {
    var t = e.target;
    if (t.closest("#float-nav-toggle")) return setOpen(nav().dataset.open !== "true");
    if (t.closest("#float-nav .float-nav-theme")) {
      var next = THEMES[(THEMES.indexOf(theme()) + 1) % THEMES.length];
      localStorage.setItem(KEY, next);
      return applyTheme(next);
    }
    if (t.closest("#float-nav .float-nav-backdrop") || t.closest("#float-nav a")) setOpen(false);
  });

  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape" || !nav() || nav().dataset.open !== "true") return;
    setOpen(false);
    el("float-nav-toggle").focus();
  });

  addEventListener("resize", function () { if (nav() && nav().dataset.open === "true") scatter(); });
  matchMedia("(prefers-color-scheme: dark)").addEventListener("change", function () {
    if (theme() === "system") applyTheme("system");
  });
})();
</script>`);
