// apps/web/src/actions/booking/booking-service.ts
import { ApiClient } from "@/lib/api-client";
import { getErrorMessage } from "@/lib/get-error-message";
import { type Booking, type BookingEndpoints } from "@shared/types";

/**
 * Service class for booking-related API calls
 */
export class BookingService {
  private static readonly BASE_PATH = "/bookings";

  /**
   * Creates a new booking request
   * POST /bookings/request
   */
  static async createBooking(
    request: Readonly<BookingEndpoints["createBooking"]["body"]>,
  ): Promise<BookingEndpoints["createBooking"]["response"]> {
    try {
      console.log("request createBooking", request);
      const response = await ApiClient.post<
        BookingEndpoints["createBooking"]["body"],
        BookingEndpoints["createBooking"]["response"]
      >(`${this.BASE_PATH}/request`, {
        body: request, // Just the CreateBookingDto
      });

      if (!response.success) {
        throw new Error("Failed to create booking");
      }

      return response.data;
    } catch (error) {
      console.error("Failed to create booking:", error);
      throw new Error(getErrorMessage(error));
    }
  }

  /**
   * Updates an existing booking
   * PATCH /bookings/:id
   */
  static async updateBooking(
    id: string,
    request: Readonly<BookingEndpoints["updateBooking"]["body"]>,
  ): Promise<BookingEndpoints["updateBooking"]["response"]> {
    try {
      const response = await ApiClient.patch<
        BookingEndpoints["updateBooking"]["body"],
        BookingEndpoints["updateBooking"]["response"]
      >(`${this.BASE_PATH}/${id}`, {
        body: request, // Just the CreateBookingDto
      });

      if (!response.success) {
        throw new Error("Failed to update booking");
      }

      return response.data;
    } catch (error) {
      console.error(`Failed to update booking ${id}:`, error);
      throw new Error(getErrorMessage(error));
    }
  }

  /**
   * Deletes a booking
   * DELETE /bookings/:id
   */
  static async deleteBooking(
    id: string,
  ): Promise<BookingEndpoints["deleteBooking"]["response"]> {
    try {
      const response = await ApiClient.delete<
        BookingEndpoints["deleteBooking"]["response"]
      >(`${this.BASE_PATH}/${id}`);

      if (!response.success) {
        throw new Error("Failed to delete booking");
      }

      return response.data;
    } catch (error) {
      console.error(`Failed to delete booking ${id}:`, error);
      throw new Error(getErrorMessage(error));
    }
  }

  /**
   * Gets all bookings for the current user
   * GET /bookings/me
   */
  static async getMyBookings(): Promise<
    BookingEndpoints["getBookingsByUserId"]["response"]
  > {
    try {
      const response = await ApiClient.get<
        BookingEndpoints["getBookingsByUserId"]["response"]
      >(`${this.BASE_PATH}/me`);

      if (!response.success) {
        throw new Error("Failed to fetch user bookings");
      }

      return response.data;
    } catch (error) {
      console.error("Failed to fetch my bookings:", error);
      throw new Error(getErrorMessage(error));
    }
  }

  /**
   * Gets booking details by ID
   * GET /bookings/:id
   */
  static async getBookingDetails(
    id: string,
  ): Promise<BookingEndpoints["getBookingDetails"]["response"]> {
    try {
      const response = await ApiClient.get<
        BookingEndpoints["getBookingDetails"]["response"]
      >(`${this.BASE_PATH}/${id}`);

      if (!response.success) {
        throw new Error("Failed to fetch booking details");
      }

      return response.data;
    } catch (error) {
      console.error(`Failed to fetch booking details for ${id}:`, error);
      throw new Error(getErrorMessage(error));
    }
  }

  /**
   * Gets all bookings (admin view)
   * GET /bookings/all
   */
  static async getAllBookings(): Promise<
    BookingEndpoints["getAllBookings"]["response"]
  > {
    try {
      const response = await ApiClient.get<
        BookingEndpoints["getAllBookings"]["response"]
      >(`${this.BASE_PATH}/all`);

      if (!response.success) {
        throw new Error("Failed to fetch all bookings");
      }

      return response.data;
    } catch (error) {
      console.error("Failed to fetch all bookings:", error);
      throw new Error(getErrorMessage(error));
    }
  }
}
