'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { differenceInDays, isPast } from 'date-fns'
import { calculateFine } from '@/lib/utils/library-logic'

export async function returnBook(formData: FormData) {
    const isbn = formData.get('isbn') as string
    const studentId = formData.get('studentId') as string

    if (!isbn || !studentId) {
        return { success: false, error: "Missing ISBN or Student ID" }
    }

    try {
        // 1. Find the currently active issue (where returnDate is null)
        const issue = await prisma.issue.findFirst({
            where: {
                isbn: isbn,
                studentId: studentId,
                returnDate: null
            }
        })

        if (!issue) {
            throw new Error("No active issuance found for this student and book.")
        }

        // 2. Calculate the Fine using centralized logic
        const { fine: fineAmount } = calculateFine(issue.dueDate)

        // 3. The Atomic Transaction
        await prisma.$transaction([
            // Mark as returned and record the fine
            prisma.issue.update({
                where: { id: issue.id },
                data: {
                    returnDate: new Date(),
                    finePaid: fineAmount
                }
            }),
            // Put the book back on the shelf (increment stock)
            prisma.book.update({
                where: { isbn: isbn },
                data: { available: { increment: 1 } }
            })
        ])

        revalidatePath('/dashboard') // Refresh the member's view
        return { success: true, fine: fineAmount }

    } catch (error) {
        return { success: false, error: (error as Error).message }
    }
}