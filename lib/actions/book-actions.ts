'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function addBook(formData: FormData) {
  const title = formData.get('title') as string
  const author = formData.get('author') as string
  const category = formData.get('category') as string
  const stock = parseInt(formData.get('stock') as string)
  const isbn = formData.get('isbn') as string // Add this

  try {
    await prisma.book.create({
      data: {
        title,
        author,
        category,
        totalStock: stock,
        available: stock, // Changed from availableStock to available
        isbn: isbn,       // Add this
      },
    })
    
    revalidatePath('/manage-books')
    return { success: true }
  } catch (error) {
    console.error("Failed to add book:", error)
    return { success: false, error: "Database error" }
  }
}