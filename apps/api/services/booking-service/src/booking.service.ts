/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  and,
  bookings,
  DATABASE_CONNECTION,
  eq,
  type DrizzleDatabase,
} from '@microservices/database';
import { status } from '@grpc/grpc-js';
import { type BookingProto } from '@microservices/proto';
import { Inject, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { dateToTimestamp } from '@microservices/common';

@Injectable()
export class BookingService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly database: DrizzleDatabase,
  ) {}

  public async getBookingsByUserId(
    request: BookingProto.GetBookingsRequest,
  ): Promise<BookingProto.GetBookingsResponse> {
    try {
      if (!request.user) {
        throw new RpcException({
          code: status.NOT_FOUND,
          message: 'User not found',
        });
      }

      const items = await this.database
        .select()
        .from(bookings)
        .where(eq(bookings.userId, request.user.id));

      return {
        $type: 'api.booking.GetBookingsResponse',
        bookings: items.map((b) => ({
          $type: 'api.booking.Booking',
          id: b.id,
          itemId: b.itemId,
          userId: b.userId,
          startTime: dateToTimestamp(b.startTime),
          endTime: dateToTimestamp(b.endTime),
          note: b.note ?? '',
          status: b.status ?? 'pending',
          createdAt: dateToTimestamp(b.createdAt!),
          updatedAt: dateToTimestamp(b.updatedAt!),
        })),
      };
    } catch (error: unknown) {
      console.error(`[ERROR] getBookingsByUserId: ${JSON.stringify(error)}`);
      if (error instanceof RpcException) throw error;
      throw new RpcException({
        code: status.INTERNAL,
        message: error instanceof Error ? error.message : 'Internal error',
      });
    }
  }

  public async createBooking(
    request: BookingProto.CreateBookingRequest,
  ): Promise<BookingProto.Booking> {
    try {
      console.log(request);
      if (!request.user || !request.booking) {
        throw new RpcException({
          code: status.INVALID_ARGUMENT,
          message: 'Invalid request',
        });
      }

      if (!request.booking.startTime || !request.booking.endTime) {
        throw new RpcException({
          code: status.INVALID_ARGUMENT,
          message: 'startTime and endTime are required',
        });
      }

      const now = new Date();
      const newBookingData = {
        userId: request.user.id,
        itemId: request.booking.itemId,
        startTime: new Date(request.booking.startTime),
        endTime: new Date(request.booking.endTime),
        note: request.booking.note ?? '',
        status: request.booking.status ?? 'pending',
        createdAt: now,
        updatedAt: now,
      };

      const [newBooking] = await this.database
        .insert(bookings)
        .values(newBookingData)
        .returning();

      if (!newBooking) {
        throw new RpcException({
          code: status.INTERNAL,
          message: 'Booking not created',
        });
      }

      return {
        $type: 'api.booking.Booking',
        id: newBooking.id,
        itemId: newBooking.itemId,
        userId: newBooking.userId,
        startTime: dateToTimestamp(newBooking.startTime),
        endTime: dateToTimestamp(newBooking.endTime),
        note: newBooking.note ?? '',
        status: newBooking.status!,
        createdAt: dateToTimestamp(newBooking.createdAt!),
        updatedAt: dateToTimestamp(newBooking.updatedAt!),
      };
    } catch (error: unknown) {
      console.error(`[ERROR] createBooking: ${JSON.stringify(error)}`);
      if (error instanceof RpcException) throw error;
      throw new RpcException({
        code: status.INTERNAL,
        message: error instanceof Error ? error.message : 'Internal error',
      });
    }
  }

  public async updateBooking(
    request: BookingProto.UpdateBookingRequest,
  ): Promise<BookingProto.Booking> {
    try {
      if (!request.user || !request.booking || !request.bookingId) {
        throw new RpcException({
          code: status.INVALID_ARGUMENT,
          message: 'Invalid request',
        });
      }

      if (!request.booking.startTime || !request.booking.endTime) {
        throw new RpcException({
          code: status.INVALID_ARGUMENT,
          message: 'startTime and endTime are required',
        });
      }

      const now = new Date();
      const updatedBookingData = {
        itemId: request.booking.itemId,
        startTime: new Date(request.booking.startTime),
        endTime: new Date(request.booking.endTime),
        note: request.booking.note ?? '',
        status: request.booking.status ?? 'pending',
        updatedAt: now,
      };

      const [updatedBooking] = await this.database
        .update(bookings)
        .set(updatedBookingData)
        .where(
          and(
            eq(bookings.userId, request.user.id),
            eq(bookings.id, request.bookingId),
          ),
        )
        .returning();

      if (!updatedBooking) {
        throw new RpcException({
          code: status.NOT_FOUND,
          message: 'Booking not found',
        });
      }

      return {
        $type: 'api.booking.Booking',
        id: updatedBooking.id,
        itemId: updatedBooking.itemId,
        userId: updatedBooking.userId,
        startTime: dateToTimestamp(updatedBooking.startTime),
        endTime: dateToTimestamp(updatedBooking.endTime),
        note: updatedBooking.note ?? '',
        status: updatedBooking.status!,
        createdAt: dateToTimestamp(updatedBooking.createdAt!),
        updatedAt: dateToTimestamp(updatedBooking.updatedAt!),
      };
    } catch (error: unknown) {
      console.error(`[ERROR] updateBooking: ${JSON.stringify(error)}`);
      if (error instanceof RpcException) throw error;
      throw new RpcException({
        code: status.INTERNAL,
        message: error instanceof Error ? error.message : 'Internal error',
      });
    }
  }

  public async deleteBooking(
    request: BookingProto.DeleteBookingRequest,
  ): Promise<BookingProto.Booking> {
    try {
      if (!request.user || !request.bookingId) {
        throw new RpcException({
          code: status.INVALID_ARGUMENT,
          message: 'Invalid request',
        });
      }

      const [deletedBooking] = await this.database
        .delete(bookings)
        .where(
          and(
            eq(bookings.userId, request.user.id),
            eq(bookings.id, request.bookingId),
          ),
        )
        .returning();

      if (!deletedBooking) {
        throw new RpcException({
          code: status.NOT_FOUND,
          message: 'Booking not found',
        });
      }

      return {
        $type: 'api.booking.Booking',
        id: deletedBooking.id,
        itemId: deletedBooking.itemId,
        userId: deletedBooking.userId,
        startTime: dateToTimestamp(deletedBooking.startTime),
        endTime: dateToTimestamp(deletedBooking.endTime),
        note: deletedBooking.note ?? '',
        status: deletedBooking.status!,
        createdAt: dateToTimestamp(deletedBooking.createdAt!),
        updatedAt: dateToTimestamp(deletedBooking.updatedAt!),
      };
    } catch (error: unknown) {
      console.error(`[ERROR] deleteBooking: ${JSON.stringify(error)}`);
      if (error instanceof RpcException) throw error;
      throw new RpcException({
        code: status.INTERNAL,
        message: error instanceof Error ? error.message : 'Internal error',
      });
    }
  }
}
