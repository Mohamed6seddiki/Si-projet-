import { redirect } from "next/navigation";

import { PublicShell } from "@/components/layout/public-shell";
import { HomeContent } from "@/components/marketing/home-content";
import { getCurrentUser } from "@/lib/supabase/queries";

export default async function Home() {
  try {
    const user = await getCurrentUser();
    if (user) {
      redirect("/dashboard/reservations");
    }
  } catch {
    // If auth/session is misconfigured, still show the marketing page.
  }

  return (
    <PublicShell variant="marketing">
      <HomeContent />
    </PublicShell>
  );
}
