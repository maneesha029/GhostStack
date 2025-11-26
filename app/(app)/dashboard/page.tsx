import { Suspense } from "react";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";

export default async function DashboardPage() {
  // Allow access without auth for now (can be enabled when Supabase is configured)
  // const user = await getCurrentUser();
  // if (!user) {
  //   redirect("/onboarding");
  // }

  return (
    <Suspense fallback={<div className="p-8 text-sm text-zinc-400">Loading your workspace…</div>}>
      <DashboardShell />
    </Suspense>
  );
}


