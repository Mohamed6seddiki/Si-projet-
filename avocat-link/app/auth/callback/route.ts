import { type NextRequest, NextResponse } from "next/server";

import { getSafeRedirectPath } from "@/lib/auth/redirect";
import { createClient } from "@/lib/supabase/server";

function getOrigin(request: NextRequest) {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }

  return request.nextUrl.origin;
}

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const nextPath = getSafeRedirectPath(requestUrl.searchParams.get("next"));
  const destination = `${getOrigin(request)}${nextPath}`;

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      const loginUrl = new URL("/login", getOrigin(request));
      loginUrl.searchParams.set("next", nextPath);
      loginUrl.searchParams.set("error", "callback_failed");
      return NextResponse.redirect(loginUrl.toString());
    }
  }

  return NextResponse.redirect(destination);
}
