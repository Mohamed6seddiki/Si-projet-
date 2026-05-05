"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { SignOutButton } from "@/components/dashboard/sign-out-button";

type Props = {
  userEmail: string;
  isAvocat?: boolean;
};

function navClass(active: boolean) {
  return active
    ? "border-b-2 border-indigo-600 pb-1 text-sm font-semibold text-indigo-700"
    : "pb-1 text-sm font-medium text-slate-600 transition hover:text-indigo-600";
}

function mobileClass(active: boolean) {
  return active
    ? "shrink-0 rounded-lg bg-indigo-50 px-3 py-2 text-indigo-700 font-semibold"
    : "shrink-0 rounded-lg px-3 py-2 text-slate-600 hover:bg-slate-50";
}

export function AppTopNav({ userEmail, isAvocat = false }: Props) {
  const pathname = usePathname();
  const initial = userEmail.trim().charAt(0).toUpperCase() || "?";

  const isReservations =
    pathname === "/dashboard/reservations" || pathname === "/dashboard";
  const isAvocats = pathname.startsWith("/dashboard/avocats");
  const isHistorique = pathname.startsWith("/dashboard/historique");
  const isAvocatSpace = pathname.startsWith("/dashboard/avocat");

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 shadow-sm backdrop-blur-md supports-backdrop-filter:bg-white/80">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <Link
            href={isAvocat ? "/dashboard/avocat" : "/dashboard/reservations"}
            className="shrink-0 text-lg font-bold tracking-tight text-indigo-900"
          >
            Avocat-Link
          </Link>

          <nav
            className="hidden flex-1 items-center justify-center gap-8 md:flex"
            aria-label="Navigation principale"
          >
            {isAvocat && (
              <Link href="/dashboard/avocat" className={navClass(isAvocatSpace && !isAvocats)}>
                Espace Avocat
              </Link>
            )}
            {
              !isAvocat && (
                <>
                  <Link href="/dashboard/reservations" className={navClass(isReservations)}>
                    Réservations
                  </Link>

                  <Link href="/dashboard/historique" className={navClass(isHistorique)}>
                    Historique
                  </Link>
                </>
              )
            }

          </nav>

          <div className="ml-auto flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              className="hidden rounded-full p-2 text-slate-600 transition hover:bg-slate-100 sm:inline-flex"
              aria-label="Notifications"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
            </button>
            <div
              className="flex h-9 w-9 items-center justify-center rounded-full bg-(--accent) text-sm font-bold text-(--primary)"
              title={userEmail}
            >
              {initial}
            </div>
            <SignOutButton />
          </div>
        </div>
      </header>
      <div className="border-b border-slate-200 bg-white md:hidden">
        <nav
          className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-4 py-2 text-sm font-medium"
          aria-label="Navigation mobile"
        >
          {isAvocat && (
            <Link href="/dashboard/avocat" className={mobileClass(isAvocatSpace && !isAvocats)}>
              Espace Avocat
            </Link>
          )}
          <Link href="/dashboard/reservations" className={mobileClass(isReservations)}>
            Réservations
          </Link>
          <Link href="/dashboard/avocats" className={mobileClass(isAvocats)}>
            Annuaire
          </Link>
          <Link href="/dashboard/historique" className={mobileClass(isHistorique)}>
            Historique
          </Link>
        </nav>
      </div>
    </>
  );
}
