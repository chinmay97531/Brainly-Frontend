import { ReactNode } from "react";
import { Logo } from "./Logo";
import { StudyDesk } from "./StudyDesk";

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}

export function AuthLayout({ title, subtitle, children, footer }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-paper lg:grid lg:grid-cols-[1.05fr_0.95fr]">
      <section className="relative hidden overflow-hidden notebook-lines paper-grain lg:flex lg:flex-col lg:justify-between px-12 py-10 xl:px-16 xl:py-12">
        <div className="pointer-events-none absolute bottom-0 left-0 top-0 w-1.5 bg-[#d85a5a]/70" />
        <Logo />

        <div className="max-w-md">
          <p className="mb-3 font-hand text-2xl text-brand">for curious students</p>
          <h2 className="font-display text-[2.65rem] font-semibold leading-[1.15] tracking-tight text-ink">
            Everything you want to{" "}
            <span className="hand-underline">learn</span>, in one place.
          </h2>
          <p className="mt-5 max-w-sm text-[15px] leading-6 text-stone-600">
            Save lectures, tweets, and notes before they disappear into another tab.
          </p>
          <StudyDesk />
        </div>

        <p className="text-sm text-stone-500">
          BrainBox · keep what you mean to come back to
        </p>
      </section>

      <section className="flex min-h-screen items-center justify-center px-4 py-12 sm:px-8">
        <div className="w-full max-w-[400px]">
          <div className="mb-8 lg:hidden">
            <Logo />
            <p className="mt-4 font-display text-2xl font-semibold leading-snug text-ink">
              Everything you want to <span className="hand-underline">learn</span>.
            </p>
          </div>

          <div className="rounded-xl border border-stone-200/90 bg-cream px-6 py-7 sm:px-8">
            <div className="mb-6">
              <h1 className="font-display text-[1.85rem] font-semibold tracking-tight text-ink">
                {title}
              </h1>
              <p className="mt-1 text-sm text-stone-500">{subtitle}</p>
            </div>
            {children}
            <div className="mt-6 text-center text-sm text-stone-500">{footer}</div>
          </div>
        </div>
      </section>
    </div>
  );
}
