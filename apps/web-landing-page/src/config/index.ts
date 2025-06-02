//apps/web-landing-page/src/config/index.ts
import type { Metadata } from "next";

export const SITE_CONFIG: Metadata = {
  title: {
    default: "Inventrack | Smart Inventory & Booking Management",
    template: `%s | Inventrack`,
  },
  description:
    "Inventrack is a smart inventory and booking management system that helps teams efficiently track resources, manage bookings, and optimize equipment utilization with powerful analytics.",
  icons: {
    icon: [
      {
        url: "/icons/favicon.ico",
        href: "/icons/favicon.ico",
      },
    ],
  },
  openGraph: {
    title: "Inventrack | Smart Inventory & Booking Management",
    description:
      "Streamline your team's resource management with intelligent inventory tracking, seamless booking system, and powerful analytics. Perfect for creative agencies, tech teams, and growing organizations.",
    images: [
      {
        url: "/assets/inventrack-hero.png",
      },
    ],
  },
  metadataBase: new URL("http://localhost:3000/"),
};
