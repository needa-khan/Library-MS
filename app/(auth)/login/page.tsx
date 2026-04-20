"use client"
import { useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Landmark, Mail, Lock } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { login } from "../actions";

// Separated into its own component because useSearchParams() requires Suspense
function LoginForm() {
  const searchParams = useSearchParams();  // 👈 STEP 1: get query params

  useEffect(() => {                        // 👈 STEP 2: read ?error= and toast it
    const error = searchParams.get("error");
    if (error) toast.error(decodeURIComponent(error));
  }, [searchParams]);

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
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover"
                />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight">Maulana Azad Library</CardTitle>
          </Link>
          <CardDescription>Enter your credentials to access the digital portal</CardDescription>
        </CardHeader>

        <CardContent>
          <form action={login} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">University Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input id="email" name="email" placeholder="name@amu.ac.in" className="pl-10" type="email" required />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="password">Password</Label>
                <Link href="#" className="text-xs text-primary hover:underline">Forgot password?</Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input id="password" name="password" type="password" className="pl-10" required />
              </div>
            </div>
            <Button type="submit" className="w-full">Login</Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col space-y-4 border-t bg-slate-50/50 p-6">
          <p className="text-xs text-center text-muted-foreground">
            Don't have an account?{" "}
            <Link href="/signup" className="text-primary hover:underline">Sign up</Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

// 👈 STEP 3: wrap in Suspense here, export this as the default
export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}