// packages/types/src/api-client/booking-endpoints.ts
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
 * Booking API endpoint types - aligned with backend controller
 */
export interface BookingEndpoints {
  /** POST /bookings/request */
  createBooking: {
    body: CreateBookingDto; // Only DTO in body, user from @CurrentUser()
    response: BookingResponse;
  };

  /** PATCH /bookings/:id */
  updateBooking: {
    body: CreateBookingDto; // Only DTO in body, user from @CurrentUser(), id from URL param
    response: BookingResponse;
  };

  /** DELETE /bookings/:id */
  deleteBooking: {
    // No body needed - user from @CurrentUser(), id from URL param
    response: BookingResponse;
  };

  /** GET /bookings/me */
  getBookingsByUserId: {
    // No body needed - user from @CurrentUser()
    response: {
      bookings: BookingResponse[];
    };
  };

  /** GET /bookings/all */
  getAllBookings: {
    // No body needed - user from @CurrentUser()
    response: {
      bookings: BookingResponse[];
    };
  };

  /** GET /bookings/:id */
  getBookingDetails: {
    // No body needed - user from @CurrentUser(), id from URL param
    response: {
      booking: BookingResponse;
    };
  };
}
