'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { differenceInDays, isPast } from 'date-fns'

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

        // 2. Calculate the Fine (Matching your dashboard logic of ₹5/day)
        let fineAmount = 0
        const FINE_PER_DAY = 5
        if (isPast(issue.dueDate)) {
            const daysOverdue = Math.max(0, differenceInDays(new Date(), issue.dueDate))
            fineAmount = daysOverdue * FINE_PER_DAY
        }

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