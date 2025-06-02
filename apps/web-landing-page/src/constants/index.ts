//apps/web-landing-page/src/constants/index.ts
import { Icons } from "@shared/ui/components/landing-page/icons";

export const perks = [
  {
    Icon: Icons.Auth,
    title: "Setup & Onboard",
    info: "Create your account and set up your inventory in minutes with our guided onboarding process.",
  },
  {
    Icon: Icons.Customize,
    title: "Organize & Categorize",
    info: "Add items, set categories, and configure availability settings to match your team's workflow.",
  },
  {
    Icon: Icons.Launch,
    title: "Book & Track",
    info: "Enable seamless booking, real-time tracking, and automated notifications for optimal resource utilization.",
  },
] as const;

export const features = [
  {
    Icon: Icons.Bolt,
    title: "Instant Setup",
    info: "Get your inventory system running in minutes with our intuitive quick-start wizard.",
  },
  {
    Icon: Icons.Palette,
    title: "Smart Booking System",
    info: "Advanced booking engine with calendar integration, conflict detection, and automated approvals.",
  },
  {
    Icon: Icons.Seo,
    title: "Usage Analytics",
    info: "Comprehensive dashboards showing booking trends, utilization rates, and resource optimization insights.",
  },
  {
    Icon: Icons.Monitor,
    title: "Real-time Tracking",
    info: "Live inventory status updates, availability monitoring, and automated overdue notifications.",
  },
  {
    Icon: Icons.Shop,
    title: "Multi-location Support",
    info: "Manage inventory across multiple offices, warehouses, or project sites from a single platform.",
  },
  {
    Icon: Icons.Server,
    title: "Secure & Scalable",
    info: "Enterprise-grade security with role-based access control and unlimited scalability for growing teams.",
  },
] as const;

export const pricingCards = [
  {
    title: "Starter",
    description: "Perfect for small teams getting started",
    price: "Free",
    duration: "",
    highlight: "Essential features",
    buttonText: "Start for free",
    features: [
      "Up to 50 inventory items",
      "3 team members",
      "Basic booking system",
      "Email notifications",
    ],
    priceId: "",
  },
  {
    title: "Professional",
    description: "Ideal for growing teams and agencies",
    price: "$49",
    duration: "month",
    highlight: "Everything in Starter, plus",
    buttonText: "Upgrade to Pro",
    features: [
      "Unlimited inventory items",
      "15 team members",
      "Advanced analytics dashboard",
      "Calendar integration",
      "Custom categories & fields",
      "Bulk import/export",
    ],
    priceId: "price_1OYxkqFj9oKEERu1KfJGWxgN",
  },
  {
    title: "Enterprise",
    description: "For large organizations with complex needs",
    price: "$149",
    duration: "month",
    highlight: "Everything in Pro, plus",
    buttonText: "Contact Sales",
    features: [
      "Unlimited team members",
      "Multi-location management",
      "Advanced role permissions",
      "API access & integrations",
      "Custom branding",
      "Priority support (24/7)",
    ],
    priceId: "price_1OYxkqFj9oKEERu1NbKUxXxN",
  },
];

export const bentoCards = [
  {
    title: "Inventory Management",
    info: "Effortlessly add, categorize, and track all your equipment and resources in one centralized system.",
    imgSrc: "/assets/inventory-icon.svg",
    alt: "Inventory management dashboard",
  },
  {
    title: "Smart Booking Engine",
    info: "Intelligent booking system with conflict detection, automated approvals, and calendar synchronization.",
    imgSrc: "/assets/booking-icon.svg",
    alt: "Smart booking and scheduling system",
  },
  {
    title: "Analytics & Insights",
    info: "Comprehensive analytics showing usage patterns, popular items, and optimization opportunities.",
    imgSrc: "/assets/analytics-icon.svg",
    alt: "Usage analytics and reporting dashboard",
  },
  {
    title: "Team Collaboration",
    info: "Role-based permissions, team notifications, and collaborative workflows for seamless resource sharing.",
    imgSrc: "/assets/collaboration-icon.svg",
    alt: "Team collaboration and resource sharing",
  },
] as const;

export const reviews = [
  {
    name: "Sarah Chen",
    username: "@sarahc_design",
    body: "Inventrack revolutionized how our creative agency manages equipment. No more double-bookings or lost cameras!",
  },
  {
    name: "Marcus Rodriguez",
    username: "@marcus_dev",
    body: "The analytics dashboard is incredible. We can now see which equipment needs replacement and optimize our inventory.",
  },
  {
    name: "Emily Watson",
    username: "@emily_ops",
    body: "Setup was so easy! Had our entire office inventory tracked and bookable within 30 minutes. Game changer.",
  },
  {
    name: "David Kim",
    username: "@davidk_photo",
    body: "Love the calendar integration. I can see equipment availability right in my booking workflow. Brilliant!",
  },
  {
    name: "Jessica Moore",
    username: "@jess_producer",
    body: "The notification system keeps everyone accountable. No more overdue returns or forgotten bookings.",
  },
  {
    name: "Alex Thompson",
    username: "@alex_creative",
    body: "Multi-location support is perfect for our distributed team. Finally, one system to manage everything!",
  },
] as const;
