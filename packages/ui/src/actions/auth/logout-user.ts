//packages/ui/src/actions/auth/logout-user.ts
"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function logoutUser(): Promise<void> {
  const cookieStore = await cookies();

  console.log("Before clearing - Auth:", cookieStore.get("Authentication"));
  console.log("Before clearing - Refresh:", cookieStore.get("Refresh"));

  cookieStore.delete("Authentication");
  cookieStore.delete("Refresh");

  console.log("After clearing - Auth:", cookieStore.get("Authentication"));
  console.log("After clearing - Refresh:", cookieStore.get("Refresh"));

  return redirect(`${process.env.NEXT_PUBLIC_AUTH_APP_URL}/sign-in`);
}
