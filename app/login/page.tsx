import { Stethoscope } from "lucide-react";
import { LoginForm } from "@/components/features/auth/login-form";
import { ThemeToggle } from "@/components/layout/theme-toggle";

export default function LoginPage() {
  return (
    <main className="relative flex min-h-0 flex-1 items-center justify-center overflow-y-auto px-4 py-12">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,var(--surface-glow-a),transparent_52%),radial-gradient(ellipse_at_bottom_right,var(--surface-glow-b),transparent_55%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.22] dark:opacity-[0.18] [background-image:radial-gradient(oklch(0.45_0.04_210/0.2)_1px,transparent_1px)] [background-size:22px_22px]"
      />

      <div className="absolute top-4 right-4 z-50 md:top-6 md:right-6">
        <ThemeToggle />
      </div>

      <section className="relative w-full max-w-md animate-in fade-in slide-in-from-bottom-2 duration-500">
        <div className="rounded-3xl border border-border/60 bg-card/90 p-8 shadow-[0_28px_80px_-36px_oklch(0.3_0.05_210/0.55)] backdrop-blur-xl dark:shadow-[0_28px_80px_-28px_oklch(0_0_0/0.65)]">
          <div className="mb-8 flex flex-col items-center text-center">
            <div className="mb-5 flex size-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-[0_14px_36px_-14px_oklch(0.5_0.1_185/0.8)] transition-transform duration-300 hover:scale-[1.03]">
              <Stethoscope className="size-7" />
            </div>
            <p className="font-heading text-lg font-semibold tracking-tight text-foreground">
              Doctor Tracker
            </p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
              Welcome back
            </h1>
            <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Sign in to manage doctors, patients, and clinic insights.
            </p>
          </div>

          <LoginForm />
        </div>
      </section>
    </main>
  );
}
