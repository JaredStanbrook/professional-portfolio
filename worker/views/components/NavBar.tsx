import { html, raw } from "hono/html";
import { PropsUser } from "@server/schema/auth.schema";

// --- CONFIGURATION ---
/**
 * Nav items per role. Everyone sees `default`; a signed-in user also sees the
 * union of the lists for every role they hold, de-duplicated by href.
 *
 * The menu is icons only, so every entry needs an icon that says what it is
 * on its own (registered in worker/components/lib/icons.ts) and a name, which
 * becomes the accessible label and the caption under the icon.
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
 * The name under each icon. Every item is the same width with its caption
 * centred, so the labels line up along each row of the grid.
 */
const caption =
  "pointer-events-none mt-2 block truncate text-center text-xs font-medium text-foreground";

// --- MAIN NAVBAR ---

interface NavBarProps {
  appName: string;
  user?: PropsUser | null;
  currentPath?: string;
}

/**
 * The whole nav: one frosted circle fixed in the top-right corner. Pressing
 * it blurs the page and blobs the items out of it one at a time into an even
 * grid in the middle of the screen, where they bob gently in a wave until one
 * is picked, the backdrop is clicked, Escape is pressed, or the circle is
 * pressed again.
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
    <li class="float-nav-item">
      <div class="float-nav-drift flex flex-col items-center">
        ${content}
        <span class="${caption}" aria-hidden="true">${label}</span>
      </div>
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
 * Open/close, the grid layout, and the theme cycle.
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
   * Lay the items out as an even grid centred on the screen — up to four
   * columns, three on a phone, with a short last row centred — and park each
   * one on the launcher, which is where it springs out from and returns to.
   */
  var CELL_W = 112, CELL_H = 104, SIZE = 56;
  function arrange() {
    var list = items(), n = list.length, btn = el("float-nav-toggle");
    if (!n || !btn) return;
    var w = innerWidth, h = innerHeight;
    var cols = Math.min(n, w >= 640 ? 4 : 3);
    var rows = Math.ceil(n / cols);
    var top = Math.max(88, (h - rows * CELL_H) / 2);
    var b = btn.getBoundingClientRect();
    list.forEach(function (li, i) {
      var row = Math.floor(i / cols), col = i % cols;
      var inRow = row === rows - 1 ? n - row * cols : cols;
      var left = (w - inRow * CELL_W) / 2;
      li.style.setProperty("--i", i);
      li.style.setProperty("--n", n);
      li.style.setProperty("--x", left + col * CELL_W + "px");
      li.style.setProperty("--y", top + row * CELL_H + "px");
      li.style.setProperty("--from-x", b.left + b.width / 2 - CELL_W / 2 + "px");
      li.style.setProperty("--from-y", b.top + b.height / 2 - SIZE / 2 + "px");
    });
  }

  /**
   * Move the items without animating the move. Changing the position
   * variables of a closed item would otherwise run the close transition, so
   * an item opened mid-way would set off from somewhere between its old spot
   * and the button rather than from the button.
   */
  function arrangeInstantly() {
    var list = items();
    list.forEach(function (li) { li.style.transition = "none"; });
    arrange();
    void document.body.offsetWidth;
    list.forEach(function (li) { li.style.transition = ""; });
    void document.body.offsetWidth;
  }

  function setOpen(open) {
    var n = nav(), btn = el("float-nav-toggle");
    if (!n || !btn) return;
    if (open) arrangeInstantly();
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

  // Fresh markup from a swap: show the right theme icon, park the items on
  // the button, start closed.
  applyTheme(theme());
  arrangeInstantly();
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

  // Open: re-grid in place. Closed: keep the items parked on the button.
  addEventListener("resize", function () {
    if (nav() && nav().dataset.open === "true") arrange(); else arrangeInstantly();
  });
  matchMedia("(prefers-color-scheme: dark)").addEventListener("change", function () {
    if (theme() === "system") applyTheme("system");
  });
})();
</script>`);
