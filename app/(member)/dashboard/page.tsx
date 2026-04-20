import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { AlertCircle, Clock, BookOpen } from "lucide-react"
import { calculateFine, formatINR } from "@/lib/utils/library-logic"
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { redirect } from "next/navigation"
import { differenceInCalendarDays } from "date-fns"

export default async function MemberDashboard() {
  // 1. Get the authenticated user from Supabase
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // 2. Security Check: If no user, send them back to login
  if (!user) {
    redirect("/login")
  }

  // 3. Fetch the profile from your Prisma database
  const profile = await prisma.user.findUnique({
    where: { id: user.id }
  })

  // 4. Fetch the user's active (unreturned) issued books from the DB
  const activeIssues = profile?.studentId
    ? await prisma.issue.findMany({
      where: {
        studentId: profile.studentId,
        returnDate: null, // only currently borrowed books
      },
      include: {
        book: true, // get book title, author, etc.
      },
      orderBy: {
        dueDate: "asc", // most urgent first
      },
    })
    : []

  return (
    <div className="space-y-8 p-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">
          {profile ? `Welcome, ${profile.name}` : "Welcome to the Library"}
        </h2>
        <p className="text-muted-foreground">
          {activeIssues.length === 0
            ? "You have no books currently issued."
            : `You have ${activeIssues.length} book${activeIssues.length > 1 ? "s" : ""} currently issued.`}
        </p>
      </div>

      {activeIssues.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center text-muted-foreground gap-4">
          <BookOpen className="w-12 h-12 opacity-30" />
          <p className="text-lg font-medium">No books issued yet.</p>
          <p className="text-sm">Browse the catalog to find a book to borrow.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {activeIssues.map((issue) => {
            const { fine, daysOverdue } = calculateFine(issue.dueDate);
            const isOverdue = fine > 0;

            // Progress = how far through the loan period we are (capped at 100%)
            const totalLoanDays = differenceInCalendarDays(issue.dueDate, issue.issueDate);
            const daysElapsed = differenceInCalendarDays(new Date(), issue.issueDate);
            const progress = totalLoanDays > 0
              ? Math.min(100, Math.round((daysElapsed / totalLoanDays) * 100))
              : 100;

            const dueDateStr = issue.dueDate.toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            });

            return (
              <Card key={issue.id} className={isOverdue ? "border-destructive/50 shadow-md" : "shadow-sm"}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-lg font-medium">{issue.book.title}</CardTitle>
                  {isOverdue ? (
                    <AlertCircle className="text-destructive w-5 h-5" />
                  ) : (
                    <Clock className="text-muted-foreground w-5 h-5" />
                  )}
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className={isOverdue ? "text-destructive font-semibold" : "text-muted-foreground font-medium"}>
                      {isOverdue ? `Overdue by ${daysOverdue} day${daysOverdue > 1 ? "s" : ""}` : "On Time"}
                    </span>
                    <span className="font-mono text-muted-foreground">Due: {dueDateStr}</span>
                  </div>

                  <Progress
                    value={progress}
                    className={isOverdue ? "bg-destructive/20" : ""}
                  />

                  {isOverdue && (
                    <div className="mt-4 p-3 bg-destructive/10 rounded-lg border border-destructive/20">
                      <p className="text-sm text-destructive font-bold">
                        Fine accumulated: {formatINR(fine)}
                      </p>
                      <p className="text-xs text-destructive/80">
                        Please return to the library as soon as possible.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  )
}
