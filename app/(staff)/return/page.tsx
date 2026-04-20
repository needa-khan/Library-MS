"use client"
export const dynamic = "force-dynamic";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { returnBook } from "@/lib/actions/returnBook"

export default function ReturnBookPage() {

    const handleReturn = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        // We can show a loading toast here if we want
        const promise = returnBook(formData);

        toast.promise(promise, {
            loading: 'Processing return...',
            success: (result) => {
                if (!result.success) throw new Error(result.error);

                // Custom success message based on whether there was a fine
                if (result.fine && result.fine > 0) {
                    return `Book returned successfully! Collect fine: ₹${result.fine}`;
                }
                return "Book returned successfully! No fine due.";
            },
            error: (err) => err.message || "Failed to process return."
        });

        // Reset the form on successful submission
        const form = e.target as HTMLFormElement;
        promise.then((res) => { if (res.success) form.reset() });
    };

    return (
        <div className="max-w-xl mx-auto space-y-6 p-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Return a Book</h2>
                <p className="text-muted-foreground">Process a returned book and calculate fines.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Return Details</CardTitle>
                    <CardDescription>Scan or enter the Member ID and Book ISBN.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleReturn} className="space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="studentId">Member / Student ID</Label>
                                <Input id="studentId" name="studentId" placeholder="e.g. 2023-CS-101" required />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="isbn">Book ISBN</Label>
                                <Input id="isbn" name="isbn" placeholder="e.g. 978-0131103627" required />
                            </div>
                        </div>

                        <Button type="submit" className="w-full h-12 text-lg">
                            Process Return
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}