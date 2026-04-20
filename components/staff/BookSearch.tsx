"use client"
import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Edit, Trash2, Search } from "lucide-react"

export function BookSearch({ initialBooks }: { initialBooks: any[] }) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredBooks = initialBooks.filter(book => 
    book.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-card border rounded-lg">
      <div className="p-4 border-b">
         <Input 
            placeholder="Search by title..." 
            onChange={(e) => setSearchTerm(e.target.value)}
          />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Author</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredBooks.map((book) => (
            <TableRow key={book.id}>
              <TableCell className="font-medium">{book.title}</TableCell>
              <TableCell>{book.author}</TableCell>
              <TableCell>{book.totalStock}</TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="icon"><Edit size={16} /></Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}