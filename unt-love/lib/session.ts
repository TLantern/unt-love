import 'server-only'
import { SignJWT, jwtVerify, type JWTPayload } from 'jose'
import { cookies } from 'next/headers'

const secretKey = process.env.SESSION_SECRET || 'fallback-secret-key-for-development'
const encodedKey = new TextEncoder().encode(secretKey)

export interface SessionPayload extends JWTPayload {
  userId: string
  email: string
  expiresAt: Date
}

export async function encrypt(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(encodedKey)
}

export async function decrypt(session: string | undefined = '') {
  try {
    console.log('[decrypt] Starting session decryption, session length:', session?.length || 0)
    console.log('[decrypt] Session value preview:', session?.substring(0, 20) + '...')
    console.log('[decrypt] Secret key exists:', !!secretKey)
    console.log('[decrypt] Using secret key length:', secretKey.length)
    
    if (!session) {
      console.log('[decrypt] No session token provided')
      return null
    }
    
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ['HS256'],
    })
    console.log('[decrypt] Successfully decrypted session for userId:', payload.userId)
    return payload as SessionPayload
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    const errorName = error instanceof Error ? error.name : 'Unknown'
    console.error('[decrypt] Failed to verify session:', errorMessage)
    console.error('[decrypt] Error name:', errorName)
    console.error('[decrypt] Full error:', error)
    return null
  }
}

export async function createSession(userId: string, email: string) {
  console.log('[createSession] Creating session for user:', userId, 'email:', email)
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
  console.log('[createSession] Session expires at:', expiresAt)
  
  const session = await encrypt({ userId, email, expiresAt })
  console.log('[createSession] Encrypted session token length:', session.length)
  
  const cookieStore = await cookies()

  cookieStore.set('session', session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: expiresAt,
    sameSite: 'lax',
    path: '/',
  })
  console.log('[createSession] Session cookie set successfully')
}

export async function deleteSession() {
  const cookieStore = await cookies()
  cookieStore.delete('session')
}

export async function getSession() {
  console.log('[getSession] Starting session retrieval')
  const cookieStore = await cookies()
  
  // Debug: log all cookies
  const allCookies = cookieStore.getAll()
  console.log('[getSession] All cookies:', allCookies.map(c => ({ name: c.name, hasValue: !!c.value })))
  
  const sessionCookie = cookieStore.get('session')
  console.log('[getSession] Session cookie exists:', !!sessionCookie)
  console.log('[getSession] Session cookie value length:', sessionCookie?.value?.length || 0)
  
  const session = sessionCookie?.value
  if (!session) {
    console.log('[getSession] No session cookie found')
    return null
  }
  
  const decrypted = await decrypt(session)
  console.log('[getSession] Final result:', {
    decryptionSuccessful: !!decrypted,
    hasUserId: !!decrypted?.userId,
    userId: decrypted?.userId
  })
  return decrypted
}