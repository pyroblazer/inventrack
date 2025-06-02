"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "./use-current-user";

export function useRoleRedirect() {
  const { user, isLoading, error } = useCurrentUser();
  const router = useRouter();

  alert("use role redirect activated");

  useEffect(() => {
    //If there's an authentication error, redirect to auth
    if (!isLoading && (error || !user)) {
      const authUrl = process.env.NEXT_PUBLIC_AUTH_APP_URL || "/sign-in";
      window.location.href = authUrl;
      return;
    }

    if (!isLoading && user) {
      const currentPath = window.location.pathname;

      // Redirect based on role if on generic dashboard
      if (currentPath === "/dashboard") {
        if (user.role === "ADMIN") {
          router.replace("/dashboard/admin");
        } else {
          router.replace("/dashboard/staff");
        }
      }

      // Prevent staff from accessing admin routes
      if (user.role === "STAFF" && currentPath.startsWith("/admin")) {
        router.replace("/dashboard/staff");
      }

      // Prevent non-admin from accessing inventory management
      if (user.role !== "ADMIN" && currentPath.startsWith("/inventory")) {
        router.replace("/browse");
      }
    }
  }, [user, isLoading, error, router]);

  return { user, isLoading, error };
}
