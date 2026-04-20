import Link from "next/link"
import { LayoutDashboard, BookSearch, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { logout } from "@/app/(auth)/actions"

export default function MemberLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-card hidden md:flex flex-col">
        <div className="p-6 text-xl font-bold border-b">Student Portal</div>
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/dashboard" className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary transition-colors">
            <LayoutDashboard size={20} /> Dashboard
          </Link>
          <Link href="/browse" className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary transition-colors">
            <BookSearch size={20} /> Browse Catalog
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

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-8">
        {children}
      </main>
    </div>
  )
}