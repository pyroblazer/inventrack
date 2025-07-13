/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
// apps/api/services/booking-service/src/booking.service.ts
import {
  and,
  bookings,
  inventoryItems, // Import inventoryItems table
  users, // Import users table
  DATABASE_CONNECTION,
  eq,
  alias,
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

      // Create aliases to avoid table type conflict issues
      const inventoryAlias = alias(inventoryItems, 'inventory');
      const usersAlias = alias(users, 'user');

      const bookingResults = await this.database
        .select({
          id: bookings.id,
          itemId: bookings.itemId,
          userId: bookings.userId,
          startTime: bookings.startTime,
          endTime: bookings.endTime,
          note: bookings.note,
          status: bookings.status,
          createdAt: bookings.createdAt,
          updatedAt: bookings.updatedAt,
          itemName: inventoryAlias.name,
          userName: usersAlias.username,
          userEmail: usersAlias.email,
        })
        .from(bookings)
        .leftJoin(inventoryAlias as any, eq(bookings.itemId, inventoryAlias.id))
        .leftJoin(usersAlias as any, eq(bookings.userId, usersAlias.id))
        .where(eq(bookings.userId, request.user.id));

      return {
        $type: 'api.booking.GetBookingsResponse',
        bookings: bookingResults.map((b) => ({
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
          itemName: b.itemName ?? 'Unknown Item',
          userName: b.userName ?? 'Unknown User',
          userEmail: b.userEmail ?? '',
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

  public async getAllBookings(
    request: BookingProto.GetAllBookingsRequest,
  ): Promise<BookingProto.GetBookingsResponse> {
    try {
      if (!request.user) {
        throw new RpcException({
          code: status.NOT_FOUND,
          message: 'User not found',
        });
      }

      // Use aliases for consistency
      const inventoryAlias = alias(inventoryItems, 'inventory');
      const usersAlias = alias(users, 'user');

      // Join bookings with inventoryItems and users to get names for all bookings
      const bookingResults = await this.database
        .select({
          // Booking fields
          id: bookings.id,
          itemId: bookings.itemId,
          userId: bookings.userId,
          startTime: bookings.startTime,
          endTime: bookings.endTime,
          note: bookings.note,
          status: bookings.status,
          createdAt: bookings.createdAt,
          updatedAt: bookings.updatedAt,
          // Item fields
          itemName: inventoryAlias.name,
          // User fields
          userName: usersAlias.username,
          userEmail: usersAlias.email,
        })
        .from(bookings)
        .leftJoin(inventoryAlias as any, eq(bookings.itemId, inventoryAlias.id))
        .leftJoin(usersAlias as any, eq(bookings.userId, usersAlias.id));

      return {
        $type: 'api.booking.GetBookingsResponse',
        bookings: bookingResults.map((b) => ({
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
          itemName: b.itemName ?? 'Unknown Item',
          userName: b.userName ?? 'Unknown User',
          userEmail: b.userEmail ?? '',
        })),
      };
    } catch (error: unknown) {
      console.error(`[ERROR] getAllBookings: ${JSON.stringify(error)}`);
      if (error instanceof RpcException) throw error;
      throw new RpcException({
        code: status.INTERNAL,
        message: error instanceof Error ? error.message : 'Internal error',
      });
    }
  }

  public async getBookingDetails(
    request: BookingProto.GetBookingDetailsRequest,
  ): Promise<BookingProto.BookingDetails> {
    try {
      if (!request.user || !request.bookingId) {
        throw new RpcException({
          code: status.INVALID_ARGUMENT,
          message: 'Invalid request',
        });
      }

      // Use aliases for consistency
      const inventoryAlias = alias(inventoryItems, 'inventory');
      const usersAlias = alias(users, 'user');

      const [bookingResult] = await this.database
        .select({
          // Booking fields
          id: bookings.id,
          itemId: bookings.itemId,
          userId: bookings.userId,
          startTime: bookings.startTime,
          endTime: bookings.endTime,
          note: bookings.note,
          status: bookings.status,
          createdAt: bookings.createdAt,
          updatedAt: bookings.updatedAt,
          // Item fields
          itemName: inventoryAlias.name,
          // User fields
          userName: usersAlias.username,
          userEmail: usersAlias.email,
        })
        .from(bookings)
        .leftJoin(inventoryAlias, eq(bookings.itemId, inventoryAlias.id))
        .leftJoin(usersAlias, eq(bookings.userId, usersAlias.id))
        .where(eq(bookings.id, request.bookingId));

      if (!bookingResult) {
        throw new RpcException({
          code: status.NOT_FOUND,
          message: 'Booking not found',
        });
      }

      // Check if user owns the booking or is admin (you might want to add role check here)
      if (bookingResult.userId !== request.user.id) {
        // Add role-based access control here if needed
        // For now, allowing access to any authenticated user
      }

      return {
        $type: 'api.booking.BookingDetails',
        booking: {
          $type: 'api.booking.Booking',
          id: bookingResult.id,
          itemId: bookingResult.itemId,
          userId: bookingResult.userId,
          startTime: dateToTimestamp(bookingResult.startTime),
          endTime: dateToTimestamp(bookingResult.endTime),
          note: bookingResult.note ?? '',
          status: bookingResult.status ?? 'pending',
          createdAt: dateToTimestamp(bookingResult.createdAt!),
          updatedAt: dateToTimestamp(bookingResult.updatedAt!),
          itemName: bookingResult.itemName ?? 'Unknown Item',
          userName: bookingResult.userName ?? 'Unknown User',
          userEmail: bookingResult.userEmail ?? '',
        },
      };
    } catch (error: unknown) {
      console.error(`[ERROR] getBookingDetails: ${JSON.stringify(error)}`);
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

      // Use aliases for consistency
      const inventoryAlias = alias(inventoryItems, 'inventory');
      const usersAlias = alias(users, 'user');

      // Fetch item and user names for the response
      const [bookingWithNames] = await this.database
        .select({
          id: bookings.id,
          itemId: bookings.itemId,
          userId: bookings.userId,
          startTime: bookings.startTime,
          endTime: bookings.endTime,
          note: bookings.note,
          status: bookings.status,
          createdAt: bookings.createdAt,
          updatedAt: bookings.updatedAt,
          itemName: inventoryAlias.name,
          userName: usersAlias.username,
          userEmail: usersAlias.email,
        })
        .from(bookings)
        .leftJoin(inventoryAlias as any, eq(bookings.itemId, inventoryAlias.id))
        .leftJoin(usersAlias as any, eq(bookings.userId, usersAlias.id))
        .where(eq(bookings.id, newBooking.id));

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
        itemName: bookingWithNames?.itemName ?? 'Unknown Item',
        userName: bookingWithNames?.userName ?? 'Unknown User',
        userEmail: bookingWithNames?.userEmail ?? '',
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
            // eq(bookings.userId, request.user.id),
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

      // Use aliases for consistency
      const inventoryAlias = alias(inventoryItems, 'inventory');
      const usersAlias = alias(users, 'user');

      // Fetch item and user names for the response
      const [bookingWithNames] = await this.database
        .select({
          id: bookings.id,
          itemId: bookings.itemId,
          userId: bookings.userId,
          startTime: bookings.startTime,
          endTime: bookings.endTime,
          note: bookings.note,
          status: bookings.status,
          createdAt: bookings.createdAt,
          updatedAt: bookings.updatedAt,
          itemName: inventoryAlias.name,
          userName: usersAlias.username,
          userEmail: usersAlias.email,
        })
        .from(bookings)
        .leftJoin(inventoryAlias as any, eq(bookings.itemId, inventoryAlias.id))
        .leftJoin(usersAlias as any, eq(bookings.userId, usersAlias.id))
        .where(eq(bookings.id, updatedBooking.id));

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
        itemName: bookingWithNames?.itemName ?? 'Unknown Item',
        userName: bookingWithNames?.userName ?? 'Unknown User',
        userEmail: bookingWithNames?.userEmail ?? '',
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
}
