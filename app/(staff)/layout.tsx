import Link from "next/link"
import { PlusCircle, BookType, Undo2, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { logout } from "@/app/(auth)/actions"
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'

export default async function StaffLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const dbUser = await prisma.user.findUnique({ where: { id: user.id } })

  // The Bouncer: Kick them out if they aren't authorized
  if (!dbUser || (dbUser.role !== 'ADMIN' && dbUser.role !== 'STAFF')) {
    redirect('/dashboard')
  }
  return (
    <div className="flex h-screen bg-background">
      {/* Staff Sidebar */}
      <aside className="w-64 border-r bg-card hidden md:flex flex-col">
        <div className="p-6 text-xl font-bold border-b text-primary">Staff Portal</div>
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/issue" className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary transition-colors">
            <PlusCircle size={20} /> Issue Book
          </Link>
          <Link href="/manage-books" className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary transition-colors">
            <BookType size={20} /> Manage Books
          </Link>
          <Link href="/return" className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary transition-colors">
            <Undo2 size={20} /> Return Books
          </Link>
        </nav>
        <div className="p-4 border-t">
          <form action={logout}>
            <Button variant="outline" type="submit" className="w-full flex items-center gap-2">
              <LogOut size={16} /> Logout
            </Button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8 bg-slate-50/50">
        {children}
      </main>
    </div>
  )
}
