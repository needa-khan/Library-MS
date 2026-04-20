"use client"
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Landmark, Mail, Lock, User } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { signup } from "../actions";

export default function SignupPage() {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="absolute inset-0 z-0 opacity-5 pointer-events-none flex items-center justify-center">
        <Landmark size={600} />
      </div>

      <Card className="w-full max-w-md z-10 shadow-xl border-t-4 border-t-primary">
        <CardHeader className="space-y-1 text-center">
          <Link href="/" className="flex flex-col items-center hover:opacity-80 transition-opacity">
            <div className="flex justify-center mb-4">
              <div className="relative w-20 h-20 overflow-hidden rounded-full shadow-sm">
                <Image
                  src="/amu2.jpg"
                  alt="AMU Logo"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight">Maulana Azad Library</CardTitle>
          </Link>
          <CardDescription>Create your account to access the digital portal</CardDescription>
        </CardHeader>

        <CardContent>
          <form action={signup} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input id="name" name="name" placeholder="Aditi Sharma" className="pl-10" required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">University Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input id="email" name="email" type="email" placeholder="name@amu.ac.in" className="pl-10" required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Create Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input id="password" name="password" type="password" className="pl-10" required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="studentId">Student ID</Label>
              <Input
                id="studentId"
                name="studentId"
                type="text"
                placeholder="Enter id for Student access"

              />
              <p className="text-[10px] text-muted-foreground">
                Leave blank if you are a staff.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="staffKey">Staff Secret Key (Optional)</Label>
              <Input
                id="staffKey"
                name="staffKey"
                type="password"
                placeholder="Enter key for Staff access"
              />
              <p className="text-[10px] text-muted-foreground">
                Leave blank if you are a student.
              </p>
            </div>
            <Button className="w-full" type="submit" disabled={isLoading}>
              {isLoading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col space-y-4 border-t bg-slate-50/50 p-6">
          <p className="text-xs text-center text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:underline">Login</Link>
          </p>
          <p className="text-xs text-center text-muted-foreground">
            By creating an account, you agree to the Library Terms of Service and Honor Code.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}