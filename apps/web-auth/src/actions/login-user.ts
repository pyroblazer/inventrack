//apps/web-auth/src/actions/login-user.ts
"use server";

import { redirect } from "next/navigation";
import type { z } from "zod";
import { getAuthCookie } from "@/lib/auth-cookie";
import { loginFormSchema } from "@/schemas/login-schema";
import { getErrorMessage } from "@/lib/get-error-message";
import { setResponseCookies } from "@/lib/set-cookies";
import { getApiUrl, getMainAppUrl } from "@/lib/utils";

export default async function loginUser(
  formData: z.infer<typeof loginFormSchema>,
): Promise<void> {
  let succeeded = false;
  let userRole = "STAFF"; // default role

  try {
    // Validate the form data
    loginFormSchema.parse(formData);

    console.log("validate form data done");

    const res = await fetch(`${getApiUrl()}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (!res.ok) {
      throw new Error("Credentials are invalid");
    }

    const responseData = await res.json();

    // Extract user role from response if available
    if (responseData.user?.role) {
      userRole = responseData.user.role;
    }

    console.log("Extrated User Role");

    console.log("res login-user", res);

    const cookie = getAuthCookie(res);

    console.log("Cookie Set");
    await setResponseCookies(cookie);
    succeeded = true;
  } catch (error) {
    console.error(`[ERROR] Failed to login user:`, error);
    throw new Error(getErrorMessage(error));
  }

  if (succeeded) {
    // Redirect based on user role
    const baseUrl = getMainAppUrl();
    if (userRole === "ADMIN") {
      redirect(`${baseUrl}/admin`);
    } else {
      redirect(`${baseUrl}/staff`);
    }
  }
}
