"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "./use-current-user";

export function useRoleRedirect() {
  const { user, isLoading } = useCurrentUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      const currentPath = window.location.pathname;

      // Redirect based on role if on generic dashboard
      if (currentPath === "/dashboard") {
        if (user.role === "admin") {
          router.replace("/dashboard/admin");
        } else {
          router.replace("/dashboard/staff");
        }
      }

      // Prevent staff from accessing admin routes
      if (user.role === "staff" && currentPath.startsWith("/admin")) {
        router.replace("/dashboard/staff");
      }

      // Prevent non-admin from accessing inventory management
      if (user.role !== "admin" && currentPath.startsWith("/inventory")) {
        router.replace("/browse");
      }
    }
  }, [user, isLoading, router]);

  return { user, isLoading };
}
