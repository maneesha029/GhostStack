import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/supabase/server'
import { MockCraftPage } from '@/components/mockcraft/mockcraft-page'

export default async function MockCraftRoute() {
  const user = await getCurrentUser()
  if (!user) {
    redirect('/onboarding')
  }

  return (
    <Suspense fallback={<div className="p-8 text-sm text-zinc-400">Loading MockCraft AI...</div>}>
      <MockCraftPage />
    </Suspense>
  )
}

