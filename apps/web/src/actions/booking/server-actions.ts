"use server";

import { BookingService } from "@/actions/booking/booking-service";
import { type BookingEndpoints, Booking } from "@shared/types";

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
 * Gets bookings for the currently logged-in user
 */
export async function getMyBookings(): Promise<
  BookingEndpoints["getBookingsByUserId"]["response"]
> {
  return BookingService.getMyBookings();
}

/**
 * Gets all bookings (admin)
 */
export async function getAllBookings(): Promise<Booking[]> {
  return BookingService.getAllBookings();
}
