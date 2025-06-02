"use server";

import { redirect } from "next/navigation";
import type { z } from "zod";
import { getAuthCookie } from "@/lib/auth-cookie";
import type { registerFormSchema } from "@/schemas/register-schema";
import { getErrorMessage } from "@/lib/get-error-message";
import { setResponseCookies } from "@/lib/set-cookies";
import { getApiUrl, getMainAppUrl } from "@/lib/utils";

export default async function registerUser(
  formData: z.infer<typeof registerFormSchema>,
): Promise<void> {
  let succeeded = false;
  try {
    // Validate that we have all required fields
    if (!formData.username || !formData.email || !formData.password) {
      throw new Error("Missing required fields");
    }

    console.log("formData", formData);

    // Create a new object without the confirmPassword field
    const registrationData = {
      username: formData.username,
      email: formData.email,
      password: formData.password,
    };

    const res = await fetch(`${getApiUrl()}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(registrationData),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || "Registration failed");
    }

    const cookie = getAuthCookie(res);
    await setResponseCookies(cookie);
    succeeded = true;
  } catch (error) {
    console.error(`[ERROR] Failed to register user:`, error);
    throw new Error(getErrorMessage(error));
  }
  if (succeeded) {
    redirect(getMainAppUrl());
  }
}
