import type { Metadata } from "next";

export const SITE_CONFIG: Metadata = {
  title: {
    default: "Inventrack | AI Powered Components Organizer",
    template: `%s | Inventrack`,
  },
  description:
    "Inventrack is an AI powered components organizer that helps you build your next project faster. Test and document your components in one place.",
  icons: {
    icon: [
      {
        url: "/icons/favicon.ico",
        href: "/icons/favicon.ico",
      },
    ],
  },
  openGraph: {
    title: "Inventrack | AI Powered Components Organizer",
    description:
      "Inventrack is an AI powered components organizer that helps you build your next project faster. Test and document your components in one place.",
    images: [
      {
        url: "/assets/hero-image.png",
      },
    ],
  },
  metadataBase: new URL("http://localhost:3002/"),
};
