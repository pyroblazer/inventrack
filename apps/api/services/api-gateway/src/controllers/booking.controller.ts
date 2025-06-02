//apps/api/services/api-gateway/src/controllers/booking.controller.ts
import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  OnModuleInit,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { type ClientGrpc } from '@nestjs/microservices';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  CurrentUser,
  JwtAuthGuard,
  dateToTimestamp,
} from '@microservices/common';
import { BookingProto } from '@microservices/proto';
import { GrpcClientProxy } from '../proxies/grpc-client.proxy';
import { handleGrpcError } from '../utils/grpc-error.util';

/**
 * Controller for managing booking operations via gRPC with the booking microservice.
 * @class BookingController
 */
@ApiTags('Bookings')
@ApiBearerAuth()
@Controller('bookings')
@UseGuards(JwtAuthGuard)
export class BookingController implements OnModuleInit {
  private bookingService: BookingProto.BookingServiceClient;

  constructor(
    @Inject('BOOKING_SERVICE') private readonly client: ClientGrpc,
    private readonly grpcClient: GrpcClientProxy,
  ) {}

  public onModuleInit(): void {
    this.bookingService =
      this.client.getService<BookingProto.BookingServiceClient>(
        'BookingService',
      );
  }

  /**
   * Creates a new booking request
   * @param {BookingProto.User} user - Authenticated user
   * @param {BookingProto.CreateBookingDto} createBookingDto - Booking request data
   * @returns {Promise<BookingProto.Booking>} The created booking
   * @throws {GrpcException} When gRPC service fails
   */
  @ApiOperation({ summary: 'Create new booking request' })
  @ApiBody({ type: JSON.stringify(BookingProto.CreateBookingDto) })
  @ApiResponse({
    status: 201,
    description: 'Booking created',
    type: JSON.stringify(BookingProto.Booking),
  })
  @ApiResponse({ status: 500, description: 'gRPC service error' })
  @Post('request')
  public async createBooking(
    @CurrentUser() user: BookingProto.User,
    @Body() createBookingDto: BookingProto.CreateBookingDto,
  ): Promise<BookingProto.Booking> {
    try {
      console.log('create booking', createBookingDto);
      const request: BookingProto.CreateBookingRequest = {
        $type: 'api.booking.CreateBookingRequest',
        user,
        booking: {
          ...createBookingDto,
          $type: 'api.booking.CreateBookingDto',
        },
      };

      return await this.grpcClient.call<BookingProto.Booking>(
        this.bookingService.createBooking(request),
        'Booking.CreateBooking',
      );
    } catch (error) {
      handleGrpcError(error);
    }
  }

  /**
   * Retrieves all bookings made by the current user
   * @param {BookingProto.User} user - Authenticated user
   * @returns {Promise<BookingProto.GetBookingsResponse>} List of bookings
   * @throws {GrpcException} When gRPC service fails
   */
  @ApiOperation({ summary: 'Get current user bookings' })
  @ApiResponse({
    status: 200,
    description: 'Bookings retrieved',
    type: JSON.stringify(BookingProto.GetBookingsResponse),
  })
  @ApiResponse({ status: 500, description: 'gRPC service error' })
  @Get('me')
  public async getMyBookings(
    @CurrentUser() user: BookingProto.User,
  ): Promise<BookingProto.GetBookingsResponse> {
    try {
      const request: BookingProto.GetBookingsRequest = {
        $type: 'api.booking.GetBookingsRequest',
        user,
      };

      return await this.grpcClient.call<BookingProto.GetBookingsResponse>(
        this.bookingService.getBookingsByUserId(request),
        'Booking.GetBookingsByUserId',
      );
    } catch (error) {
      handleGrpcError(error);
    }
  }

  /**
   * Retrieves all bookings (admin use)
   * @param {BookingProto.User} user - Authenticated user
   * @returns {Promise<BookingProto.GetBookingsResponse>} List of all bookings
   * @throws {GrpcException} When gRPC service fails
   */
  @ApiOperation({ summary: 'Get all bookings (admin)' })
  @ApiResponse({
    status: 200,
    description: 'Bookings retrieved',
    type: JSON.stringify(BookingProto.GetBookingsResponse),
  })
  @ApiResponse({ status: 500, description: 'gRPC service error' })
  @Get('all')
  public async getAllBookings(
    @CurrentUser() user: BookingProto.User,
  ): Promise<BookingProto.GetBookingsResponse> {
    try {
      const request: BookingProto.GetAllBookingsRequest = {
        $type: 'api.booking.GetAllBookingsRequest',
        user,
      };

      return await this.grpcClient.call<BookingProto.GetBookingsResponse>(
        this.bookingService.getAllBookings(request), // Changed method name
        'Booking.GetAllBookings',
      );
    } catch (error) {
      handleGrpcError(error);
    }
  }

  /**
   * Retrieves booking detail by ID
   * @param {BookingProto.User} user - Authenticated user
   * @param {string} bookingId - ID of the booking
   * @returns {Promise<BookingProto.BookingDetails>} Booking details
   * @throws {GrpcException} When gRPC service fails
   */
  @ApiOperation({ summary: 'Get booking details by ID' })
  @ApiResponse({
    status: 200,
    description: 'Booking details retrieved',
    type: JSON.stringify(BookingProto.BookingDetails),
  })
  @ApiResponse({ status: 500, description: 'gRPC service error' })
  @Get(':id')
  public async getBookingDetails(
    @CurrentUser() user: BookingProto.User,
    @Param('id') bookingId: string,
  ): Promise<BookingProto.BookingDetails> {
    try {
      const request: BookingProto.GetBookingDetailsRequest = {
        $type: 'api.booking.GetBookingDetailsRequest',
        user,
        bookingId,
      };

      return await this.grpcClient.call<BookingProto.BookingDetails>(
        this.bookingService.getBookingDetails(request),
        'Booking.GetBookingDetails',
      );
    } catch (error) {
      handleGrpcError(error);
    }
  }

  /**
   * Updates a booking (e.g., approve, reject, or modify status)
   * @param {BookingProto.User} user - Authenticated user
   * @param {string} bookingId - Booking ID
   * @param {BookingProto.CreateBookingDto} updateBookingDto - Booking update data
   * @returns {Promise<BookingProto.Booking>} Updated booking
   * @throws {GrpcException} When gRPC service fails
   */
  @ApiOperation({ summary: 'Update a booking' })
  @ApiBody({ type: JSON.stringify(BookingProto.CreateBookingDto) })
  @ApiResponse({
    status: 200,
    description: 'Booking updated',
    type: JSON.stringify(BookingProto.Booking),
  })
  @ApiResponse({ status: 500, description: 'gRPC service error' })
  @Patch(':id')
  public async updateBooking(
    @CurrentUser() user: BookingProto.User,
    @Param('id') bookingId: string,
    @Body() updateBookingDto: BookingProto.CreateBookingDto,
  ): Promise<BookingProto.Booking> {
    try {
      const request: BookingProto.UpdateBookingRequest = {
        $type: 'api.booking.UpdateBookingRequest',
        user,
        bookingId,
        booking: updateBookingDto,
      };

      return await this.grpcClient.call<BookingProto.Booking>(
        this.bookingService.updateBooking(request),
        'Booking.UpdateBooking',
      );
    } catch (error) {
      handleGrpcError(error);
    }
  }

  /**
   * Deletes a booking
   * @param {BookingProto.User} user - Authenticated user
   * @param {string} bookingId - ID of the booking to delete
   * @returns {Promise<BookingProto.Booking>} Deleted booking
   * @throws {GrpcException} When gRPC service fails
   */
  @ApiOperation({ summary: 'Delete a booking' })
  @ApiResponse({
    status: 200,
    description: 'Booking deleted',
    type: JSON.stringify(BookingProto.Booking),
  })
  @ApiResponse({ status: 500, description: 'gRPC service error' })
  @Delete(':id')
  public async deleteBooking(
    @CurrentUser() user: BookingProto.User,
    @Param('id') bookingId: string,
  ): Promise<BookingProto.Booking> {
    try {
      const request: BookingProto.DeleteBookingRequest = {
        $type: 'api.booking.DeleteBookingRequest',
        user,
        bookingId,
      };

      return await this.grpcClient.call<BookingProto.Booking>(
        this.bookingService.deleteBooking(request),
        'Booking.DeleteBooking',
      );
    } catch (error) {
      handleGrpcError(error);
    }
  }
}
