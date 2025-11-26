import { Suspense } from 'react'
import { MockCraftPage } from '@/components/mockcraft/mockcraft-page'

export default async function MockCraftRoute() {
  // Allow access without auth for now (can be enabled when Supabase is configured)
  // const user = await getCurrentUser()
  // if (!user) {
  //   redirect('/onboarding')
  // }

  return (
    <Suspense fallback={<div className="p-8 text-sm text-zinc-400">Loading MockCraft AI...</div>}>
      <MockCraftPage />
    </Suspense>
  )
}

