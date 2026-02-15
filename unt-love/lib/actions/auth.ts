'use server'

import { redirect } from 'next/navigation'
import { createServiceRoleClient } from '@/lib/supabase/server'
import { isValidUNTEmail } from '@/lib/auth/verification'
import { createSession, deleteSession } from '@/lib/session'

export interface AuthState {
  errors?: {
    email?: string[]
    _form?: string[]
  }
}

export async function signup(prevState: AuthState | undefined, formData: FormData): Promise<AuthState> {
  console.log('[signup] Starting signup process')
  const email = formData.get('email') as string
  console.log('[signup] Email received:', email)

  // Validate email
  if (!email) {
    console.log('[signup] No email provided')
    return { errors: { email: ['Email is required'] } }
  }

  if (!isValidUNTEmail(email)) {
    console.log('[signup] Invalid UNT email:', email)
    return { errors: { email: ['Must use a valid UNT student email (@my.unt.edu)'] } }
  }

  try {
    const supabaseAdmin = createServiceRoleClient()

    // Check if user already exists
    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers({
      page: 1,
      perPage: 100 // Increase if you expect more users, or implement pagination
    })
    
    const existingUser = existingUsers?.users.find(user => user.email === email)
    
    if (existingUser) {
      // User exists - create session and redirect
      console.log('[signup] Existing user found, creating session for:', existingUser.id)
      await createSession(existingUser.id, existingUser.email!)
      console.log('[signup] Session created, redirecting to /about-you')
      redirect('/about-you')
    }

    // Create new user
    const { data: authUser, error: signUpError } = await supabaseAdmin.auth.admin.createUser({
      email,
      email_confirm: true, // Auto-confirm since we're validating UNT email domain
    })

    if (signUpError || !authUser.user) {
      return { errors: { _form: ['Failed to create user account'] } }
    }

    // Create session
    console.log('[signup] New user created, creating session for:', authUser.user.id)
    await createSession(authUser.user.id, authUser.user.email!)
    console.log('[signup] Session created for new user, redirecting to /about-you')
    
  } catch (error) {
    console.error('Signup error:', error)
    return { errors: { _form: ['An unexpected error occurred'] } }
  }

  redirect('/about-you')
}

export async function logout() {
  await deleteSession()
  redirect('/verify')
}