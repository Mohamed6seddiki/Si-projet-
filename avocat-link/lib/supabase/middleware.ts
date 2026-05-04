import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

import { getSupabaseEnv } from "@/lib/env";
import type { Database } from "@/lib/supabase/database.types";

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request,
  });

  const { url, anonKey } = getSupabaseEnv();

  const supabase = createServerClient<Database>(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        for (const cookie of cookiesToSet) {
          request.cookies.set(cookie.name, cookie.value);
        }

        response = NextResponse.next({
          request,
        });

        for (const cookie of cookiesToSet) {
          response.cookies.set(cookie.name, cookie.value, cookie.options);
        }
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;
  const isAuthPath = path === "/login" || path === "/auth/forgot-password";
  if (user && isAuthPath) {
    const redirectUrl = request.nextUrl.clone();
    const role = user.user_metadata?.role;
    redirectUrl.pathname = role === "avocat" || role === "lawyer"
      ? "/dashboard/avocat"
      : "/dashboard/reservations";
    redirectUrl.search = "";
    return NextResponse.redirect(redirectUrl);
  }

  if (path.startsWith("/dashboard")) {
    if (!user) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/login";
      redirectUrl.searchParams.set(
        "next",
        `${path}${request.nextUrl.search}`,
      );
      return NextResponse.redirect(redirectUrl);
    }

    if (path.startsWith("/dashboard/avocat")) {
      const role = user.user_metadata?.role;
      if (role !== "avocat" && role !== "lawyer") {
        const redirectUrl = request.nextUrl.clone();
        redirectUrl.pathname = "/dashboard/reservations";
        redirectUrl.search = "";
        return NextResponse.redirect(redirectUrl);
      }
    }
  }

  return response;
}
