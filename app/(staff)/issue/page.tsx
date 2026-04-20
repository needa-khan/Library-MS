"use client"
export const dynamic = "force-dynamic";

import { useState } from "react"
import { addWeeks, format } from "date-fns" // Helper library for dates
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { toast } from "sonner" // For "Exceptional" notifications
import { issueBook } from "@/lib/actions/issueBook"

export default function IssueBookPage() {
  const [duration, setDuration] = useState("1") // weeks
  const SEMESTER_END = new AppData().semesterEnd; // Mocking June 30th

  const calculateDueDate = () => {
    if (duration === "semester") return new Date(2026, 5, 30); // June 30, 2026
    return addWeeks(new Date(), parseInt(duration));
  };

  const handleIssue = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Create FormData from the form element
    const formData = new FormData(e.currentTarget);

    // Append the calculated date to the form data
    formData.append("dueDate", calculateDueDate().toISOString());

    // Call the server action
    const result = await issueBook(formData);

    if (result.success) {
      toast.success("Book issued successfully!");
    } else {
      toast.error(result.error || "Failed to issue book");
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Issue a Book</h2>
        <p className="text-muted-foreground">Register a new book issuance for a member.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Issuance Details</CardTitle>
          <CardDescription>Select the member, book, and borrowing period.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleIssue} className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="studentId">Member ID (Student ID)</Label>
                <Input id="studentId" name="studentId" placeholder="e.g. 23cobea564" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="isbn">Book ISBN</Label>
                <Input id="isbn" name="isbn" placeholder="e.g. 978-1-2345-6789-0" required />
              </div>
            </div>

            <div className="space-y-4">
              <Label>Borrowing Duration</Label>
              <RadioGroup defaultValue="1" onValueChange={setDuration} className="grid grid-cols-2 gap-4">
                <div>
                  <RadioGroupItem value="1" id="1w" className="peer sr-only" />
                  <Label htmlFor="1w" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                    <span className="text-sm font-medium">1 Week</span>
                  </Label>
                </div>
                <div>
                  <RadioGroupItem value="2" id="2w" className="peer sr-only" />
                  <Label htmlFor="2w" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                    <span className="text-sm font-medium">2 Weeks</span>
                  </Label>
                </div>
                <div>
                  <RadioGroupItem value="3" id="3w" className="peer sr-only" />
                  <Label htmlFor="3w" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                    <span className="text-sm font-medium">3 Weeks</span>
                  </Label>
                </div>
                <div>
                  <RadioGroupItem value="semester" id="sem" className="peer sr-only" />
                  <Label htmlFor="sem" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                    <span className="text-sm font-medium">Full Semester</span>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="rounded-lg bg-muted p-4 flex justify-between items-center">
              <span className="text-sm font-medium">Calculated Due Date:</span>
              <span className="text-sm font-bold text-primary">
                {format(calculateDueDate(), "PPP")}
              </span>
            </div>

            <Button type="submit" className="w-full h-12 text-lg">Confirm Issuance</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

// Simple helper class for semester logic
class AppData {
  semesterEnd = new Date(2026, 5, 30);
}