import { Controller, Logger } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { BookingService } from './booking.service';
import { BookingProto } from '@microservices/proto';

@Controller()
export class BookingController {
  private readonly logger = new Logger(BookingController.name);

  constructor(private readonly bookingService: BookingService) {}

  @GrpcMethod('BookingService', 'GetBookingsByUserId')
  async getBookingsByUserId(
    request: BookingProto.GetBookingsRequest,
  ): Promise<BookingProto.GetBookingsResponse> {
    this.logger.log('GetBookingsByUserId request received:', request);
    try {
      const response = await this.bookingService.getBookingsByUserId(request);
      this.logger.log('GetBookingsByUserId response:', {
        count: response.bookings.length,
      });
      return response;
    } catch (error) {
      this.logger.error('GetBookingsByUserId error:', error);
      throw error;
    }
  }

  @GrpcMethod('BookingService', 'CreateBooking')
  async createBooking(
    request: BookingProto.CreateBookingRequest,
  ): Promise<BookingProto.Booking> {
    this.logger.log('CreateBooking request received:', {
      userId: request.user?.id,
    });
    try {
      this.logger.log('CreateBooking request:', request);
      const created = await this.bookingService.createBooking(request);
      this.logger.log('CreateBooking response:', { bookingId: created.id });
      return created;
    } catch (error) {
      this.logger.error('CreateBooking error:', error);
      throw error;
    }
  }

  @GrpcMethod('BookingService', 'UpdateBooking')
  async updateBooking(
    request: BookingProto.UpdateBookingRequest,
  ): Promise<BookingProto.Booking> {
    this.logger.log('UpdateBooking request received:', {
      bookingId: request.bookingId,
    });
    try {
      const updated = await this.bookingService.updateBooking(request);
      this.logger.log('UpdateBooking response:', { bookingId: updated.id });
      return updated;
    } catch (error) {
      this.logger.error('UpdateBooking error:', error);
      throw error;
    }
  }
}
