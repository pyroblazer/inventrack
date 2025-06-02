"use client";

import type React from "react";

import { useCurrentUser } from "@/hooks/use-current-user";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Skeleton } from "@shared/ui/components/ui/skeleton";

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { user, isLoading, error } = useCurrentUser();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // If there's an authentication error or no user after loading
    console.log("auth guard user", user);
    console.log("auth guard user", user);
    // if (!isLoading && (!user || error)) {
    //   const authUrl = process.env.NEXT_PUBLIC_AUTH_APP_URL || "/sign-in"

    //   // Don't redirect if we're already on an auth page
    //   if (!pathname.startsWith("/sign-in") && !pathname.startsWith("/sign-up")) {
    //     window.location.href = authUrl
    //   }
    // }
  }, [user, isLoading, error, router, pathname]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="space-y-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
    );
  }

  // Show error state if authentication failed
  if (error && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-xl font-semibold">Authentication Error</h2>
          <p className="text-muted-foreground">Please sign in to continue</p>
        </div>
      </div>
    );
  }

  // If user is authenticated, render children
  if (user) {
    return <>{children}</>;
  }

  // Fallback loading state
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-32" />
      </div>
    </div>
  );
}
