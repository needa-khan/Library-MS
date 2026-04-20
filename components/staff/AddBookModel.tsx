'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { addBook } from "@/lib/actions/book-actions"

export function AddBookModal() {
  const [open, setOpen] = useState(false)

  async function handleSubmit(formData: FormData) {
    const result = await addBook(formData)
    if (result.success) {
      setOpen(false) // Close modal on success
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Plus size={18} /> Add New Book
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add to Library Inventory</DialogTitle>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="title">Book Title</Label>
            <Input id="title" name="title" placeholder="e.g. Clean Code" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="author">Author</Label>
            <Input id="author" name="author" placeholder="Robert C. Martin" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input id="category" name="category" placeholder="Software" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stock">Total Stock</Label>
              <Input id="stock" name="stock" type="number" min="1" defaultValue="1" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="isbn">ISBN</Label>
              <Input id="isbn" name="isbn" placeholder="e.g. 978-0132350884" required />
            </div>
          </div>
          <Button type="submit" className="w-full">Save to Inventory</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}