//apps/api/services/api-gateway/src/controllers/booking.controller.ts
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Inject } from '@nestjs/common';
import { CurrentUser, JwtAuthGuard } from '@microservices/common';
import { BookingProto } from '@microservices/proto';
import { firstValueFrom } from 'rxjs';
import { type CreateBookingDto } from '@shared/types';
import { dateToTimestamp } from '@microservices/common';

@Controller('bookings')
@UseGuards(JwtAuthGuard)
export class BookingController {
  constructor(
    @Inject('BOOKING_SERVICE') private readonly bookingClient: ClientProxy,
  ) {}

  /**
   * Creates a new booking request
   * POST /bookings/request
   */
  @Post('request')
  async createBooking(
    @CurrentUser() user: BookingProto.User,
    @Body() createBookingDto: CreateBookingDto,
  ): Promise<BookingProto.Booking> {
    const request: BookingProto.CreateBookingRequest = {
      $type: 'api.booking.CreateBookingRequest',
      user,
      booking: {
        $type: 'api.booking.CreateBookingDto',
        itemId: createBookingDto.itemId,
        startTime: dateToTimestamp(createBookingDto.startTime),
        endTime: dateToTimestamp(createBookingDto.endTime),
        note: createBookingDto.note,
        status: createBookingDto.status,
      },
    };

    return await firstValueFrom(
      this.bookingClient.send('BookingService.CreateBooking', request),
    );
  }

  /**
   * Gets all bookings for the current user
   * GET /bookings/me
   */
  @Get('me')
  async getMyBookings(
    @CurrentUser() user: BookingProto.User,
  ): Promise<BookingProto.GetBookingsResponse> {
    const request: BookingProto.GetBookingsRequest = {
      $type: 'api.booking.GetBookingsRequest',
      user,
    };

    return await firstValueFrom(
      this.bookingClient.send('BookingService.GetBookingsByUserId', request),
    );
  }

  /**
   * Gets all bookings (admin view)
   * GET /bookings/all
   */
  @Get('all')
  async getAllBookings(
    @CurrentUser() user: BookingProto.User,
  ): Promise<BookingProto.GetBookingsResponse> {
    // Note: You might want to add admin role checking here
    const request: BookingProto.GetBookingsRequest = {
      $type: 'api.booking.GetBookingsRequest',
      user,
    };

    return await firstValueFrom(
      this.bookingClient.send('BookingService.GetBookingsByUserId', request),
    );
  }

  /**
   * Gets booking details by ID
   * GET /bookings/:id
   */
  @Get(':id')
  async getBookingDetails(
    @CurrentUser() user: BookingProto.User,
    @Param('id') bookingId: string,
  ): Promise<BookingProto.BookingDetails> {
    const request: BookingProto.GetBookingDetailsRequest = {
      $type: 'api.booking.GetBookingDetailsRequest',
      user,
      bookingId,
    };

    return await firstValueFrom(
      this.bookingClient.send('BookingService.GetBookingDetails', request),
    );
  }

  /**
   * Updates an existing booking (including approve/reject/status change)
   * PATCH /bookings/:id
   */
  @Patch(':id')
  async updateBooking(
    @CurrentUser() user: BookingProto.User,
    @Param('id') bookingId: string,
    @Body() updateBookingDto: BookingProto.CreateBookingDto,
  ): Promise<BookingProto.Booking> {
    const request: BookingProto.UpdateBookingRequest = {
      $type: 'api.booking.UpdateBookingRequest',
      user,
      bookingId,
      booking: updateBookingDto,
    };

    return await firstValueFrom(
      this.bookingClient.send('BookingService.UpdateBooking', request),
    );
  }

  /**
   * Deletes a booking
   * DELETE /bookings/:id
   */
  @Delete(':id')
  async deleteBooking(
    @CurrentUser() user: BookingProto.User,
    @Param('id') bookingId: string,
  ): Promise<BookingProto.Booking> {
    const request: BookingProto.DeleteBookingRequest = {
      $type: 'api.booking.DeleteBookingRequest',
      user,
      bookingId,
    };

    return await firstValueFrom(
      this.bookingClient.send('BookingService.DeleteBooking', request),
    );
  }
}
