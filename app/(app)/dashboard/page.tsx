import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/supabase/server";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/onboarding");
  }

  return (
    <Suspense fallback={<div className="p-8 text-sm text-zinc-400">Loading your workspace…</div>}>
      <DashboardShell />
    </Suspense>
  );
}


