'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'

export async function login(formData: FormData) {
  console.log("LOGIN ATTEMPT STARTED");
  const supabase = await createClient();

  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  console.log(`Attempting login for: ${email}`);

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error("LOGIN ERROR:", error.message);
    return redirect('/login?error=' + encodeURIComponent(error.message));
  }

  console.log("LOGIN SUCCESSFUL - REDIRECTING...");
  const { data: { user } } = await supabase.auth.getUser()
  const profile = await prisma.user.findUnique({ where: { id: user?.id } })

  if (profile?.role === 'STAFF' || profile?.role === 'ADMIN') {
    redirect('/manage-books')
  } else {
    redirect('/dashboard')
  }
}

export async function signup(formData: FormData) {
  const supabase = await createClient()
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const name = formData.get('name') as string
  let studentId = formData.get('studentId') as string // Changed to 'let' so we can modify it
  const staffKey = formData.get('staffKey') as string

  // 1. Define your Secret Key
  const ADMIN_SECRET_KEY = "AMU_STAFF_2026"

  // 2. Determine Role
  const assignedRole = staffKey === ADMIN_SECRET_KEY ? 'STAFF' : 'MEMBER'

  // --- NEW SAFETY CHECK ---
  // If it's a student and they left the ID blank, reject the signup BEFORE Supabase gets involved
  if (assignedRole === 'MEMBER' && !studentId) {
    // Redirecting back to signup instead of login so they can try again
    return redirect('/signup?error=' + encodeURIComponent("Student ID is required for members."))
  }

  // If it's a Staff member and they left the ID blank, generate a safe dummy ID for the database
  if (assignedRole === 'STAFF' && !studentId) {
    studentId = `STAFF-${Date.now()}`
  }
  // ------------------------

  // 3. Auth Signup (Supabase)
  const { data, error } = await supabase.auth.signUp({ email, password })

  if (error) {
    return redirect('/signup?error=' + encodeURIComponent(error.message))
  }

  // 4. Database Sync (Prisma)
  if (data.user) {
    try {
      await prisma.user.create({
        data: {
          id: data.user.id,
          email: email,
          name: name,
          studentId: studentId, // Now guaranteed to exist and be unique!
          role: assignedRole,
        },
      })
    } catch (e) {
      console.error("DB Error:", e)
    }
  }

  // 5. Smart Redirect
  if (assignedRole === 'STAFF') {
    redirect('/manage-books')
  } else {
    redirect('/dashboard?new=true')
  }
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/login')
}