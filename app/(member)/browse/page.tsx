export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma"
import BrowseClient from "@/components/shared/BrowseClient"

export default async function BrowsePage() {
  // Fetch all books from the database (added by staff via manage-books)
  const books = await prisma.book.findMany({
    orderBy: { title: "asc" },
    select: {
      id: true,
      title: true,
      author: true,
      category: true,
      available: true,
    },
  })

  // Build a unique, sorted list of categories from the real data
  const categories = [...new Set(books.map((b) => b.category))].sort()

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Browse Catalog</h2>
        <p className="text-muted-foreground">
          Find your next read from our collection of {books.length} book{books.length !== 1 ? "s" : ""}.
        </p>
      </div>

      <BrowseClient books={books} categories={categories} />
    </div>
  )
}
