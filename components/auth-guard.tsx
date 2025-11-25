"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/login");
    }
  }, [session, isPending, router]);

  // Show loading while checking session
  if (isPending) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-purple-500/20 border-t-purple-500"></div>
      </div>
    );
  }

  // Show nothing if not authenticated (will redirect)
  if (!session) {
    return null;
  }

  // Show children if authenticated
  return <>{children}</>;
}
