import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-zinc-50 dark:bg-zinc-950">
      <Card className="w-full max-w-md shadow-lg border-zinc-200 dark:border-zinc-800">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">WorkProof</CardTitle>
          <CardDescription className="text-lg text-zinc-500 dark:text-zinc-400">
            Daily Wage Payment Proof Ledger
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="text-center text-sm text-zinc-500 dark:text-zinc-400 mb-4">
            Create verifiable digital payment trails for daily wage workers.
          </div>
          <div className="flex flex-col gap-2 relative">
            <Button className="w-full text-lg h-12" asChild>
              <Link href="/login">Log In</Link>
            </Button>
            <Button variant="outline" className="w-full text-lg h-12" asChild>
              <Link href="/register">Create Account</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <footer className="mt-12 text-zinc-400 text-sm">
        &copy; {new Date().getFullYear()} WorkProof. All rights reserved.
      </footer>
    </div>
  );
}
