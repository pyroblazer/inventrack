"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function logoutUser(): Promise<void> {
  try {
    const cookieStore = await cookies();

    // Clear all auth-related cookies
    cookieStore.delete("access_token");
    cookieStore.delete("refresh_token");
    cookieStore.delete("user_session");

    // Clear any other session cookies
    const allCookies = cookieStore.getAll();
    allCookies.forEach((cookie) => {
      if (cookie.name.includes("auth") || cookie.name.includes("session")) {
        cookieStore.delete(cookie.name);
      }
    });
  } catch (error) {
    console.error("Error during logout:", error);
  }

  // Redirect to auth page
  redirect(process.env.NEXT_PUBLIC_AUTH_APP_URL || "/sign-in");
}
