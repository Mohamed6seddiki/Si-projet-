import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/supabase/queries";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  const role = user?.user_metadata?.role;

  let isAvocat = role === "avocat" || role === "lawyer";

  if (!isAvocat && user) {
    const supabase = await createClient();
    const { data } = await supabase
      .from("avocats")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle();
    if (data) {
      isAvocat = true;
    }
  }

  if (isAvocat) {
    redirect("/dashboard/avocat");
  } else {
    redirect("/dashboard/reservations");
  }
}
