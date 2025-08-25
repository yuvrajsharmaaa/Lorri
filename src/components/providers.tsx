/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client"

import { AuthUIProvider } from '@daveyplate/better-auth-ui'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { authClient } from '~/lib/auth-client'

export function Providers({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  return (
    <AuthUIProvider
      authClient={authClient}
      // eslint-disable-next-line @typescript-eslint/unbound-method
      navigate={router.push}
      // eslint-disable-next-line @typescript-eslint/unbound-method
      replace={router.replace}
      onSessionChange={() => router.refresh()}
      Link={Link}
    >
      {children}
    </AuthUIProvider>
  )
}