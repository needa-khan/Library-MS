import { prisma } from "@/lib/prisma"
import { BookSearch } from "@/components/staff/BookSearch"
import { AddBookModal } from "@/components/staff/AddBookModel"

export default async function ManageBooksPage() {
  // 1. Fetch real books from the database
  const books = await prisma.book.findMany({
    orderBy: { title: 'asc' }
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Manage Inventory</h2>
          <p className="text-muted-foreground">Add, update, or remove books.</p>
        </div>
        <AddBookModal /> 
      </div>

      {/* 2. Pass the 'books' from the database to your Search component */}
      <BookSearch initialBooks={books} />
    </div>
  )
}