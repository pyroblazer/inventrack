// apps/api/services/booking-service/src/booking.controller.ts
import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { BookingService } from './booking.service';
import { BookingProto } from '@microservices/proto';

@Controller()
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @GrpcMethod('BookingService', 'GetBookingsByUserId')
  getBookingsByUserId(
    request: BookingProto.GetBookingsRequest,
  ): Promise<BookingProto.GetBookingsResponse> {
    return this.bookingService.getBookingsByUserId(request);
  }

  @GrpcMethod('BookingService', 'CreateBooking')
  createBooking(
    request: BookingProto.CreateBookingRequest,
  ): Promise<BookingProto.Booking> {
    return this.bookingService.createBooking(request);
  }

  @GrpcMethod('BookingService', 'UpdateBooking')
  updateBooking(
    request: BookingProto.UpdateBookingRequest,
  ): Promise<BookingProto.Booking> {
    return this.bookingService.updateBooking(request);
  }
}
