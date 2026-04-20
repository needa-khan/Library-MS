"use client"
import { useState, useMemo } from "react"
import BookCard from "@/components/shared/BookCard"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { BookOpen } from "lucide-react"

interface Book {
  id: string
  title: string
  author: string
  category: string
  available: number
}

interface BrowseClientProps {
  books: Book[]
  categories: string[]
}

export default function BrowseClient({ books, categories }: BrowseClientProps) {
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("all")

  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      const matchesSearch =
        book.title.toLowerCase().includes(search.toLowerCase()) ||
        book.author.toLowerCase().includes(search.toLowerCase())
      const matchesCategory = category === "all" || book.category === category
      return matchesSearch && matchesCategory
    })
  }, [books, search, category])

  return (
    <>
      {/* Filters Row */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search by title or author..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full"
          />
        </div>
        <Select onValueChange={(value) => setCategory(value)} defaultValue="all">
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Grid */}
      {filteredBooks.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredBooks.map((book) => (
            <BookCard
              key={book.id}
              title={book.title}
              author={book.author}
              category={book.category}
              isAvailable={book.available > 0}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center text-muted-foreground gap-4 border rounded-lg bg-muted/20">
          <BookOpen className="w-12 h-12 opacity-30" />
          <p className="text-muted-foreground">No books found matching your criteria.</p>
        </div>
      )}
    </>
  )
}
