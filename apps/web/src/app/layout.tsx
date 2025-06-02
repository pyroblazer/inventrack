//apps/web/src/app/layout.tsx
import type React from "react";
import type { Metadata } from "next";
import localFont from "next/font/local";
import "@shared/ui/globals.css";
import { SidebarProvider } from "@shared/ui/components/ui/sidebar";
import { cookies } from "next/headers";
import { ToastProvider } from "@shared/ui/providers/toast-provider";
import type { JSX } from "react";
import { QueryProvider } from "@/providers/query-provider";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { NotificationCenter } from "@/components/notifications/notification-center";
import { AuthGuard } from "@/components/auth/auth-guard";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Inventrack",
  description: "Inventrack is an inventory management system",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): Promise<JSX.Element> {
  const [cookieStore] = await Promise.all([cookies()]);

  const defaultOpen = cookieStore.get("sidebar:state")?.value === "true";

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <QueryProvider>
          {/* <AuthGuard> */}
          <SidebarProvider defaultOpen={defaultOpen}>
            <AppSidebar />
            <main className="min-h-screen h-full w-full relative bg-muted">
              {/* <div className="flex justify-end p-4">
                <NotificationCenter />
              </div> */}
              {children}
            </main>
            <ToastProvider />
          </SidebarProvider>
          {/* </AuthGuard> */}
        </QueryProvider>
      </body>
    </html>
  );
}
