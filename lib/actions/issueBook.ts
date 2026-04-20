'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function issueBook(formData: FormData) {
  const isbn = formData.get('isbn') as string
  const studentId = formData.get('studentId') as string
  const dueDateStr = formData.get('dueDate') as string
  console.log("ISSUE ATTEMPT:", { isbn, studentId });
  if (!isbn || !studentId) {
    return { success: false, error: "Missing ISBN or Student ID" };
  }
  try {
    // Validate that the student and book actually exist
    const student = await prisma.user.findUnique({ where: { studentId } })
    const book = await prisma.book.findUnique({ where: { isbn } })

    if (!student) throw new Error("Student ID not found in database.")
    if (!book || book.available <= 0) throw new Error("Book not available.")

    // Atomic Transaction: decrement stock + create Issue row
    await prisma.$transaction([
      // 1. Decrease available stock on the Book
      prisma.book.update({
        where: { isbn },
        data: { available: { decrement: 1 } }
      }),
      // 2. Create Issue record storing isbn & studentId directly (matches schema)
      prisma.issue.create({
        data: {
          isbn,
          studentId,
          dueDate: dueDateStr
            ? new Date(dueDateStr)
            : new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days default
        }
      })
    ])

    revalidatePath('/manage-books')
    revalidatePath('/dashboard')
    return { success: true }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
}