//packages/types/src/api-client/booking-endpoints.ts
// @shared/types
import type { ProtoTimestamp } from "../others/proto-timestamp";
import { User } from "./users-endpoints";

export interface Booking {
  id: string;
  itemId: string;
  userId: string;
  startTime?: Date;
  endTime?: Date;
  note: string;
  status: string; // e.g., pending, approved, rejected, cancelled
  createdAt?: Date;
  updatedAt?: Date;
}

export interface BookingResponse {
  id: string;
  itemId: string;
  userId: string;
  startTime?: ProtoTimestamp;
  endTime?: ProtoTimestamp;
  note: string;
  status: string; // e.g., pending, approved, rejected, cancelled
  createdAt?: ProtoTimestamp;
  updatedAt?: ProtoTimestamp;
}

export interface CreateBookingDto {
  itemId: string;
  startTime: Date; // Either Date object or ISO string
  endTime: Date;
  note: string;
  status: string;
}

/**
 * Booking API endpoint types
 */
export interface BookingEndpoints {
  /** POST /bookings (gRPC: BookingService.CreateBooking) */
  createBooking: {
    body: {
      user: User;
      booking: CreateBookingDto;
    };
    response: BookingResponse;
  };

  /** PATCH /bookings/:id (gRPC: BookingService.UpdateBooking) */
  updateBooking: {
    body: {
      user: User;
      bookingId: string;
      booking: CreateBookingDto;
    };
    response: BookingResponse;
  };

  /** DELETE /bookings/:id (gRPC: BookingService.DeleteBooking) */
  deleteBooking: {
    body: {
      user: User;
      bookingId: string;
    };
    response: BookingResponse;
  };

  /** GET /bookings/user (gRPC: BookingService.GetBookingsByUserId) */
  getBookingsByUserId: {
    body: {
      user: User;
    };
    response: {
      bookings: BookingResponse[];
    };
  };

  /** GET /bookings/:id (gRPC: BookingService.GetBookingDetails) */
  getBookingDetails: {
    body: {
      user: User;
      bookingId: string;
    };
    response: {
      booking: BookingResponse;
    };
  };
}
