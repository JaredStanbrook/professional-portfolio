import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/contact")({
  component: Contact,
});

function Contact() {
  return (
    <div className="min-h-screen space-y-8 lg:py-20">
      <header className="space-y-4 border-b border-border pb-6">
        <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">
          Contact
        </p>
        <h1 className="text-4xl font-semibold md:text-5xl">Loves a chat.</h1>
        <p className="text-lg text-muted-foreground max-w-2xl">
          Open to learning, new challenges, and everything in between. Always
          happy to connect — I’ll reply within 48 hours.
        </p>
      </header>

      <section className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-6 space-y-3">
          <h2 className="text-xl font-semibold">Email</h2>
          <p className="text-muted-foreground">jared.stanbrook@proton.me</p>
          <a
            className="text-primary hover:text-primary/80"
            href="mailto:jared.stanbrook@proton.me"
          >
            Send a message
          </a>
        </div>
        <div className="rounded-2xl border border-border bg-card p-6 space-y-3">
          <h2 className="text-xl font-semibold">Profiles</h2>
          <a
            className="block text-primary hover:text-primary/80"
            href="https://www.linkedin.com/in/jaredstanbrook/"
            target="_blank"
            rel="noreferrer noopener"
          >
            LinkedIn
          </a>
          <a
            className="block text-primary hover:text-primary/80"
            href="https://github.com/JaredStanbrook"
            target="_blank"
            rel="noreferrer noopener"
          >
            GitHub
          </a>
        </div>
      </section>
    </div>
  );
}
