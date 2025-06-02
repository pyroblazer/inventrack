//apps/web/src/hooks/use-current-user.tsx
"use client";

import { getCurrentUser } from "@/actions/user/server-actions";
import type { User } from "@shared/types";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export function useCurrentUser(): {
  user: User | undefined;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
} {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const queryResult = useQuery({
    queryKey: ["user"],
    queryFn: getCurrentUser,
    enabled: isClient, // Only run on client-side
    retry: (failureCount, error) => {
      // Don't retry on authentication errors
      if (
        error?.message?.includes("401") ||
        error?.message?.includes("Unauthorized")
      ) {
        return false;
      }
      return failureCount < 2;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    experimental_prefetchInRender: true,
  });

  // console.log("use-current-user queryResult", queryResult);

  const { data, isLoading, error, refetch } = queryResult;

  // console.log("use-current-user data", data);

  return {
    user: data,
    isLoading,
    error: error as Error | null,
    refetch,
  };
}
