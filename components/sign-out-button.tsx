"use client";

import { signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useState } from "react";

interface SignOutButtonProps {
  variant?: "default" | "ghost" | "outline";
  className?: string;
  showIcon?: boolean;
}

export function SignOutButton({ 
  variant = "ghost", 
  className = "",
  showIcon = true 
}: SignOutButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      await signOut();
      router.push("/login");
    } catch (error) {
      console.error("Sign out failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant={variant}
      className={className}
      onClick={handleSignOut}
      disabled={isLoading}
    >
      {showIcon && <LogOut className="h-4 w-4 mr-2" />}
      {isLoading ? "Signing out..." : "Sign out"}
    </Button>
  );
}
