import 'server-only'
import { cache } from 'react'
import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'

export const verifySession = cache(async () => {
  const session = await getSession()

  if (!session?.userId) {
    redirect('/verify')
  }

  return { 
    isAuth: true, 
    userId: session.userId,
    email: session.email 
  }
})

// For API routes - returns null instead of redirecting
export const verifySessionForAPI = cache(async () => {
  console.log('[verifySessionForAPI] Starting session verification for API')
  const session = await getSession()
  console.log('[verifySessionForAPI] Session result:', {
    exists: !!session,
    hasUserId: !!session?.userId,
    userId: session?.userId,
    email: session?.email
  })

  if (!session?.userId) {
    console.log('[verifySessionForAPI] Session verification failed - no userId')
    return null
  }

  console.log('[verifySessionForAPI] Session verification successful')
  return { 
    isAuth: true, 
    userId: session.userId,
    email: session.email 
  }
})

export const getUser = cache(async () => {
  const session = await verifySession()
  if (!session) return null

  // Return user data - in this case we already have what we need from session
  return {
    id: session.userId,
    email: session.email,
  }
})