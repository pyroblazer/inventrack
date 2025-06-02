// apps/web/src/actions/booking/server-actions.ts
"use server";

import { BookingService } from "@/actions/booking/booking-service";
import { type BookingEndpoints } from "@shared/types";

/**
 * Creates a new booking
 */
export async function createBooking(
  request: Readonly<BookingEndpoints["createBooking"]["body"]>,
): Promise<BookingEndpoints["createBooking"]["response"]> {
  return BookingService.createBooking(request);
}

/**
 * Updates the booking (for approve/reject/status)
 */
export async function updateBooking(
  id: string,
  request: Readonly<BookingEndpoints["updateBooking"]["body"]>,
): Promise<BookingEndpoints["updateBooking"]["response"]> {
  return BookingService.updateBooking(id, request);
}

/**
 * Deletes a booking
 */
export async function deleteBooking(
  id: string,
): Promise<BookingEndpoints["deleteBooking"]["response"]> {
  return BookingService.deleteBooking(id);
}

/**
 * Gets bookings for the currently logged-in user
 */
export async function getMyBookings(): Promise<
  BookingEndpoints["getBookingsByUserId"]["response"]
> {
  return BookingService.getMyBookings();
}

/**
 * Gets booking details by ID
 */
export async function getBookingDetails(
  id: string,
): Promise<BookingEndpoints["getBookingDetails"]["response"]> {
  return BookingService.getBookingDetails(id);
}

/**
 * Gets all bookings (admin)
 */
export async function getAllBookings(): Promise<
  BookingEndpoints["getAllBookings"]["response"]
> {
  return BookingService.getAllBookings();
}
