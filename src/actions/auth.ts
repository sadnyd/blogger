'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { logger } from '@/lib/logger'

export async function login(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    logger.warn('Failed login attempt:', email, error.message)
    // In a real app we'd return the error to the UI instead of redirecting
    redirect('/login?error=Invalid login credentials')
  }

  redirect('/admin')
}
