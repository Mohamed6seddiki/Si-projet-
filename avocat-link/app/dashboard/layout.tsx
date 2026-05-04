import { redirect } from "next/navigation";

import { AppTopNav } from "@/components/dashboard/app-top-nav";
import { getCurrentUser } from "@/lib/supabase/queries";

type DashboardLayoutProps = {
  children: React.ReactNode;
};

export default async function DashboardLayout({ children }: DashboardLayoutProps) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login?next=/dashboard/reservations");
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[var(--background)]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_0%,rgba(37,99,235,0.06)_0%,transparent_50%),radial-gradient(circle_at_100%_10%,rgba(15,23,42,0.04)_0%,transparent_45%)]"
      />
      <a
        href="#dashboard-main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-[var(--primary)] focus:shadow-lg"
      >
        Aller au contenu
      </a>

      <AppTopNav userEmail={user.email ?? ""} />

      <main
        id="dashboard-main"
        className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-8"
      >
        {children}
      </main>
    </div>
  );
}
