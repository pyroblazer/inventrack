# Inventrack – Inventory and Booking Management Platform

**Inventrack** is a modular, enterprise-grade platform designed to help organizations manage shared inventory and staff bookings. The application follows a microservice-based backend and a microfrontend architecture for better scalability, maintainability, and team autonomy.

---

## Features

### Authentication and Authorization

- User registration and login using JWT.
- Role-based access control:

  - **Admin**: Full system access including user and inventory management.
  - **Staff**: Can view, book, and return inventory items.

### Inventory Management

- Admin can add, update, and delete inventory items.
- Supports item categorization, quantity, condition tracking, and photos.
- Real-time availability based on bookings and returns.

### Booking System

- Staff can book items based on availability and date range.
- Status transitions: `Pending`, `Approved`, `Returned`.
- Admin approval workflow and overdue tracking.

### Dashboard and Reporting

- Admin dashboard showing key usage metrics and inventory status.
- Staff dashboard showing personal bookings and status updates.
- Overdue detection and top item utilization reports.

### Notification System

- Email and/or Slack notifications for bookings, approvals, and returns.
- Event-driven architecture using a dedicated notification service.

### Additional Capabilities

- Booking history and audit logs.
- Bulk CSV upload for inventory.
- Exportable reports and audit trails.
- Real-time readiness (WebSocket/event-based patterns).

---

## Architecture Overview

Inventrack is built as a monorepo using **TurboRepo** with clearly separated apps, services, and shared libraries.

### Directory Structure

```
inventrack/
├── apps/
│   ├── api/                 # Backend-for-frontend API gateway
│   ├── web/                 # Main frontend (staff/admin dashboards)
│   ├── web-auth/            # Microfrontend for authentication
│   └── web-landing-page/    # Marketing site or documentation
│
├── services/                # Backend microservices (NestJS)
│   ├── api-gateway/         # Central request gateway
│   ├── auth-service/        # Authentication, tokens, roles
│   ├── booking-service/     # Booking logic and lifecycle
│   ├── inventory-service/   # Inventory management and state
│   ├── notification-service/# Email/Slack dispatch
│   ├── audit-service/       # Tracks user actions and system logs
│   ├── reporting-service/   # Metrics, charts, and usage summaries
│   └── user-service/        # User profile management
│
├── libs/                    # Internal libraries and SDKs
│   ├── common/              # Utility functions, shared config
│   ├── proto/               # gRPC Protobuf definitions
│   ├── database/            # Shared PostgreSQL setup
│   └── redis/               # Redis connection for shared caching
│
├── packages/                # Reusable packages and design system
│   ├── types/               # Shared types (e.g., InventoryItem)
│   ├── ui/                  # Shared React components (Tailwind-based)
│   ├── typescript-config/   # Shared typescript config
│   ├── tailwindcss-config/  # Shared tailwind config
│   └── eslint-config/       # Shared eslint config
│
├── monitoring/
│   ├── grafana/             # Dashboard configurations
│   └── prometheus/          # Prometheus metrics configuration
```

---

## Tech Stack

| Layer            | Technology                      |
| ---------------- | ------------------------------- |
| Frontend         | Next.js, React, Tailwind CSS    |
| Backend          | NestJS (Express by default)     |
| Communication    | gRPC, HTTP, Redis               |
| Authentication   | JWT, OAuth2-ready               |
| State Management | Redis for caching, availability |
| Database         | PostgreSQL                      |
| Dev Environment  | TurboRepo, PNPM, Husky          |
| Monitoring       | Prometheus, Grafana             |
| Type Safety      | TypeScript                      |
| Deployment       | Docker, CI/CD-friendly          |

---

## Getting Started

### Install Dependencies

```bash
pnpm install
pnpm run bootstrap
```

### Fill in .env based on .env.example

### Start Local Development

```bash
pnpm dev
```

Runs all services and microfrontends concurrently using TurboRepo.

---

## Scripts

```bash
pnpm dev           # Run all services and apps
pnpm build         # Build everything
pnpm test          # Run tests
pnpm lint          # Run ESLint
pnpm format        # Run Prettier
pnpm clean         # Remove node_modules and dist
```
