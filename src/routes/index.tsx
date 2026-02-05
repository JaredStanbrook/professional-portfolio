import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useRef, useCallback } from "react";
import { CardContent } from "@/components/ui/card";
import {
  HighlightCard,
  type HighlightCardSize,
} from "@/components/ui/highlight-card";
import Typewriter from "@/components/typewriter";
import type { SelectBlogMetadata } from "@server/schema/blogs.schema";
import { featuredProjects } from "@/data/projects";
import { normalizeBlogSlug } from "@/lib/utils";

export const Route = createFileRoute("/")({
  component: Homepage,
});

// --- Types ---

interface MousePosition {
  x: number;
  y: number;
}

interface CursorState {
  position: MousePosition;
  scale: number;
  isAttracted: boolean;
  isClose: boolean;
}

function Homepage() {
  const navigate = useNavigate();
  const [mousePos, setMousePos] = useState<MousePosition>({ x: 0, y: 0 });
  const [hoveringTitle, setHoveringTitle] = useState(false);
  const [cursorState, setCursorState] = useState<CursorState>({
    position: { x: 0, y: 0 },
    scale: 1,
    isAttracted: false,
    isClose: false,
  });
  const [blogs, setBlogs] = useState<SelectBlogMetadata[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const titleRef = useRef<HTMLSpanElement>(null);
  const animationRef = useRef<number | null>(null);

  // Constants
  const CURSOR_SCALE_MULTIPLIER = 35;
  const MAGNETIC_RADIUS = 400;
  const MAGNETIC_STRENGTH = 1;
  const MAX_DISTANCE_RADIUS = 150;
  const LERP_FACTOR = 0.07;

  // Fetch blog metadata on mount
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch("/api/blog");
        if (response.ok) {
          const payload: unknown = await response.json();
          const blogsData =
            typeof payload === "object" &&
            payload !== null &&
            "blogs" in payload
              ? payload.blogs
              : undefined;

          const sortedBlogs = [...(Array.isArray(blogsData) ? blogsData : [])]
            .filter(
              (blog): blog is SelectBlogMetadata =>
                typeof blog === "object" &&
                blog !== null &&
                "draft" in blog &&
                "createdAt" in blog &&
                typeof blog.draft === "boolean" &&
                typeof blog.createdAt === "string",
            )
            .filter((blog) => !blog.draft)
            .sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime(),
            );
          setBlogs(sortedBlogs);
        }
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const getTitleRect = useCallback(() => {
    if (!titleRef.current) return null;
    return titleRef.current.getBoundingClientRect();
  }, []);

  const calculateTargetCursorState = useCallback(
    (mousePosition: MousePosition): CursorState => {
      const rect = getTitleRect();
      if (!rect)
        return {
          position: mousePosition,
          scale: 1,
          isAttracted: false,
          isClose: false,
        };

      // Calculate distance to the nearest edge/corner (or 0 if inside)
      const dx = Math.max(
        rect.left - mousePosition.x,
        0,
        mousePosition.x - rect.right,
      );
      const dy = Math.max(
        rect.top - mousePosition.y,
        0,
        mousePosition.y - rect.bottom,
      );
      const distance = Math.sqrt(dx * dx + dy * dy);

      const inside =
        mousePosition.x >= rect.left &&
        mousePosition.x <= rect.right &&
        mousePosition.y >= rect.top &&
        mousePosition.y <= rect.bottom;

      const easeOutQuart = (x: number): number => {
        return 1 - Math.pow(1 - x, 4);
      };
      // --- 1. Scale Calculation ---
      let scale = 1;
      let isClose = false;
      if (inside || distance <= MAX_DISTANCE_RADIUS) {
        const proximityProgress =
          1 - Math.min(distance / MAX_DISTANCE_RADIUS, 1);
        const easedProgress = easeOutQuart(proximityProgress);
        scale = 1 + easedProgress * CURSOR_SCALE_MULTIPLIER;
        isClose = true;
      }

      // --- 2. Magnetic Position Calculation ---
      let pullX = 0;
      let pullY = 0;
      let isAttracted = false;

      if ((inside || distance < MAGNETIC_RADIUS) && distance > 0) {
        // Find the closest point on the rect to the mouse position
        const closestX = Math.max(
          rect.left,
          Math.min(mousePosition.x, rect.right),
        );
        const closestY = Math.max(
          rect.top,
          Math.min(mousePosition.y, rect.bottom),
        );

        // Calculate force strength (closer = stronger)
        const force = 1 - distance / MAGNETIC_RADIUS;
        const pullStrength = force * MAGNETIC_STRENGTH;

        // Calculate the pull OFFSET (how much to move from the raw mouse position)
        pullX = (closestX - mousePosition.x) * pullStrength;
        pullY = (closestY - mousePosition.y) * pullStrength;

        isAttracted = true;
      } else if (inside) {
        isAttracted = true;
      }

      // Apply the pull offset to the raw mouse position to get the final target position
      const targetPosition = {
        x: mousePosition.x + pullX,
        y: mousePosition.y + pullY,
      };

      return { position: targetPosition, scale, isAttracted, isClose };
    },
    [getTitleRect],
  );

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent): void => {
      // Use clientX/Y which are relative to the viewport (the frame of reference for the fixed cursor)
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    document.addEventListener("mousemove", handleMouseMove, { passive: true });

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  useEffect(() => {
    let targetCursorState: CursorState;

    const animate = (): void => {
      targetCursorState = calculateTargetCursorState(mousePos);

      // LERP the rendered cursor state towards the target state
      setCursorState((prevState) => {
        return {
          position: {
            x: Math.round(
              prevState.position.x +
                (targetCursorState.position.x - prevState.position.x) *
                  LERP_FACTOR,
            ),
            y: Math.round(
              prevState.position.y +
                (targetCursorState.position.y - prevState.position.y) *
                  LERP_FACTOR,
            ),
          },
          scale:
            prevState.scale +
            (targetCursorState.scale - prevState.scale) * LERP_FACTOR,
          isAttracted: targetCursorState.isAttracted,
          isClose: targetCursorState.isClose,
        };
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [mousePos, calculateTargetCursorState]);

  const handleTitleClick = useCallback((): void => {
    if (!titleRef.current) return;

    titleRef.current.style.transform = "scale(0.95)";
    setTimeout(() => {
      if (titleRef.current) {
        titleRef.current.style.transform = "";
      }
    }, 200);
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleBlogClick = (slug: string) => {
    navigate({ to: "/blog/$slug", params: { slug: normalizeBlogSlug(slug) } });
  };
  const cursorSize = 20 * cursorState.scale; // Base size 20px
  return (
    <div className="flex flex-col min-h-screen bg-background text-muted-foreground">
      {/* Custom Cursor - Using translate3d for hardware acceleration */}

      <div
        className={`hidden md:block fixed rounded-full pointer-events-none z-40
    ${hoveringTitle ? "bg-primary" : cursorState.isAttracted ? "bg-primary/80" : "bg-foreground/80"}
  `}
        style={{
          width: `${Math.round(cursorSize)}px`,
          height: `${Math.round(cursorSize)}px`,
          left: 0,
          top: 0,
          transform: `translate(${Math.round(cursorState.position.x - cursorSize / 2)}px, ${Math.round(cursorState.position.y - cursorSize / 2)}px)`,
        }}
      />
      <section className="w-full flex flex-col items-left pt-6 gap-2 z-50">
        <div className="overflow-hidden">
          <span
            ref={titleRef}
            onClick={() => {
              handleTitleClick();
              navigate({ to: "/about" });
            }}
            onMouseEnter={() => setHoveringTitle(true)}
            onMouseLeave={() => setHoveringTitle(false)}
            className="
              text-2xl md:text-4xl font-extrabold tracking-tight text-foreground cursor-pointer
              transition-all duration-300 select-none block whitespace-nowrap overflow-visible"
            role="button"
            tabIndex={0}
          >
            <span className="hidden md:inline">
              {cursorState.isClose ? "Learn more about me." : "I'm Jared"}
            </span>
            <div className="md:hidden inline">
              <Typewriter />
            </div>
          </span>
        </div>
        <hr className="w-full border-t-2 border-foreground opacity-30 self-center" />
      </section>
      <section className="w-full flex flex-col items-center pt-12 gap-8">
        <div className="flex flex-col justify-center w-full md:w-1/2 self-start">
          <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            Welcome
          </h1>

          <p className="uppercase text-lg md:text-xl font-semibold mb-2 text-foreground">
            Featured work
          </p>

          <p className="mt-2 text-lg md:text-xl text-muted-foreground text-justify">
            Making complex systems feel calmer.
          </p>
        </div>

        <div className="flex flex-col justify-center w-full md:w-1/2 self-end">
          <p className="text-lg md:text-xl text-muted-foreground max-w-xl text-justify">
            I care about collaboration, shared ownership, and doing the work
            that makes good discussions possible.
          </p>
        </div>
      </section>
      <section className="py-12 w-full">
        <div className="w-full flex items-center justify-center my-4">
          <span className="text-xl font-semibold tracking-widest text-foreground mr-4">
            Projects
          </span>
          <hr className="w-full border-t-2 border-foreground opacity-30 self-center" />
        </div>
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
          {featuredProjects.slice(0, 4).map((project) => (
            <Link
              key={project.slug}
              to="/projects/$slug"
              params={{ slug: project.slug }}
              className="group rounded-2xl border border-border bg-card p-5 transition hover:-translate-y-1 hover:border-primary/40"
            >
              <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
                <span className="rounded-full bg-muted px-3 py-1">
                  {project.status}
                </span>
                {project.featured && (
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-primary">
                    Featured
                  </span>
                )}
              </div>
              <h2 className="mt-4 text-xl font-semibold text-foreground">
                {project.title}
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                {project.summary}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {project.tags.slice(0, 3).map((tag) => (
                  <span
                    key={`${project.slug}-${tag}`}
                    className="rounded-full bg-muted/60 px-3 py-1 text-xs text-muted-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-6 flex justify-end">
          <Link
            to="/projects"
            className="text-sm text-primary hover:text-primary/80"
          >
            View all projects →
          </Link>
        </div>
      </section>
      <main className="py-8 w-full">
        <div className="w-full flex items-center justify-center my-4">
          <span className="text-xl font-semibold tracking-widest text-foreground mr-4">
            Recent
          </span>
          <hr className="w-full border-t-2 border-foreground opacity-30 self-center" />
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground">
            Loading blogs...
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No blogs found. Create your first one!
          </div>
        ) : (
          <div className="grid gap-6 grid-cols-1 md:grid-cols-3 auto-rows-fr">
            {blogs.map((blog) => {
              let size: HighlightCardSize;

              if (blog.readTime >= 15) size = "big";
              else if (blog.readTime >= 4) size = "long";
              else if (blog.readTime >= 3) size = "wide";
              else size = "small";

              return (
                <HighlightCard
                  key={blog.filename}
                  size={size}
                  onClick={() => handleBlogClick(blog.slug ?? blog.filename)}
                  tabIndex={0}
                  role="button"
                >
                  <CardContent className="p-4 flex flex-col justify-between h-full">
                    <div>
                      <span className="inline-block text-xs mb-2">
                        <span className="py-1 px-2 rounded-full bg-foreground text-background font-semibold">
                          {blog.subject}
                        </span>
                        <span className="ml-1 text-muted-foreground align-middle">
                          • {blog.readTime} min read
                        </span>
                      </span>
                      <h2 className="text-lg font-semibold mb-2">
                        {blog.title}
                      </h2>
                    </div>

                    <div className="text-sm mt-4">
                      {blog.authorName} • {formatDate(blog.createdAt)}
                    </div>
                  </CardContent>
                </HighlightCard>
              );
            })}
          </div>
        )}
        <div className="mt-6 flex justify-end">
          <Link
            to="/blog"
            className="text-sm text-primary hover:text-primary/80"
          >
            Visit the blog →
          </Link>
        </div>
      </main>
    </div>
  );
}
