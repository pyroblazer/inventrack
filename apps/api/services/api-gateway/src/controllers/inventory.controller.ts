//apps/api/services/api-gateway/src/controllers/inventory.controller.ts
import { CurrentUser, JwtAuthGuard } from '@microservices/common';
import { InventoryProto, UsersProto } from '@microservices/proto';
import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  NotFoundException,
  OnModuleInit,
  Param,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { type ClientGrpc } from '@nestjs/microservices';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { SkipRateLimit } from '../throttling/rate-limit.decorator';
import { GrpcClientProxy } from '../proxies/grpc-client.proxy';
import { handleGrpcError } from '../utils/grpc-error.util';
import { CACHE_TTL, CacheGroup, CacheTTL } from 'src/caching/cache.decorator';
import { CustomCacheInterceptor } from 'src/caching/custom-cache.interceptor';

/**
 * Controller handling inventory-related operations through gRPC communication
 * with the inventory microservice.
 * @class InventoryController
 */
@ApiTags('Inventory')
@ApiBearerAuth()
@Controller('inventory')
@UseInterceptors(CustomCacheInterceptor)
@CacheGroup('inventory')
export class InventoryController implements OnModuleInit {
  private inventoryService: InventoryProto.InventoryServiceClient;

  constructor(
    @Inject('INVENTORY_SERVICE') private readonly client: ClientGrpc,
    private readonly grpcClient: GrpcClientProxy,
  ) {}

  public onModuleInit(): void {
    this.inventoryService =
      this.client.getService<InventoryProto.InventoryServiceClient>(
        'InventoryService',
      );
  }

  /**
   * Retrieves all inventory items for the current user
   * @param {UsersProto.User} user - The authenticated user
   * @returns {Promise<InventoryProto.GetItemsResponse>} List of user's inventory items
   * @throws {NotFoundException} When user is not found
   * @throws {GrpcException} When gRPC service fails
   */
  @ApiOperation({ summary: 'Get all inventory items for current user' })
  @ApiResponse({
    status: 200,
    description: 'Inventory items retrieved successfully',
    type: JSON.stringify(InventoryProto.GetItemsResponse),
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 500, description: 'gRPC service error' })
  @UseGuards(JwtAuthGuard)
  @CacheTTL(CACHE_TTL.FIVE_MINUTES)
  @Get('items/my')
  public async getItemsByUserId(
    @CurrentUser() user: UsersProto.User,
  ): Promise<InventoryProto.GetItemsResponse> {
    if (!user.id) {
      throw new NotFoundException('Unauthorized: User not found');
    }

    try {
      const request: InventoryProto.GetItemsRequest = {
        $type: 'api.inventory.GetItemsRequest',
        user: {
          id: user.id,
          email: user.email,
          username: user.username || '',
          $type: 'api.inventory.User',
        },
      };

      return await this.grpcClient.call<InventoryProto.GetItemsResponse>(
        this.inventoryService.getItemsByUserId(request),
        'Inventory.getItemsByUserId',
      );
    } catch (error) {
      handleGrpcError(error);
    }
  }

  /**
   * Retrieves all inventory items (admin/public endpoint)
   * @returns {Promise<InventoryProto.GetItemsResponse>} List of all inventory items
   * @throws {GrpcException} When gRPC service fails
   */
  @ApiOperation({ summary: 'Get all inventory items' })
  @ApiResponse({
    status: 200,
    description: 'All inventory items retrieved successfully',
    type: JSON.stringify(InventoryProto.GetItemsResponse),
  })
  @ApiResponse({ status: 500, description: 'gRPC service error' })
  @SkipRateLimit() // Optional: if you want to skip rate limiting for this endpoint
  @CacheTTL(CACHE_TTL.FIVE_MINUTES)
  @Get('items')
  public async getAllItems(): Promise<InventoryProto.GetItemsResponse> {
    try {
      const request: InventoryProto.GetAllItemsRequest = {
        $type: 'api.inventory.GetAllItemsRequest',
      };

      return await this.grpcClient.call<InventoryProto.GetItemsResponse>(
        this.inventoryService.getAllItems(request),
        'Inventory.getAllItems',
      );
    } catch (error) {
      handleGrpcError(error);
    }
  }

  /**
   * Retrieves details for a specific inventory item
   * @param {UsersProto.User} user - The authenticated user
   * @param {string} itemId - The ID of the item to retrieve
   * @returns {Promise<InventoryProto.ItemDetails>} Item details
   * @throws {NotFoundException} When user or item is not found
   * @throws {GrpcException} When gRPC service fails
   */
  @ApiOperation({ summary: 'Get inventory item details' })
  @ApiParam({ name: 'itemId', type: 'string', description: 'Item ID' })
  @ApiResponse({
    status: 200,
    description: 'Item details retrieved successfully',
    type: JSON.stringify(InventoryProto.ItemDetails),
  })
  @ApiResponse({ status: 404, description: 'User or item not found' })
  @ApiResponse({ status: 500, description: 'gRPC service error' })
  @UseGuards(JwtAuthGuard)
  @CacheTTL(CACHE_TTL.FIVE_MINUTES)
  @Get('items/:itemId')
  public async getItemDetails(
    @CurrentUser() user: UsersProto.User,
    @Param('itemId') itemId: string,
  ): Promise<InventoryProto.ItemDetails> {
    if (!user.id) {
      throw new NotFoundException('Unauthorized: User not found');
    }

    try {
      const request: InventoryProto.GetItemDetailsRequest = {
        $type: 'api.inventory.GetItemDetailsRequest',
        user: {
          id: user.id,
          email: user.email,
          username: user.username || '',
          $type: 'api.inventory.User',
        },
        itemId,
      };

      return await this.grpcClient.call<InventoryProto.ItemDetails>(
        this.inventoryService.getItemDetails(request),
        'Inventory.getItemDetails',
      );
    } catch (error) {
      handleGrpcError(error);
    }
  }

  /**
   * Creates a new inventory item
   * @param {UsersProto.User} user - The authenticated user
   * @param {InventoryProto.CreateItemDto} createItemDto - Item creation data
   * @returns {Promise<InventoryProto.Item>} The created item
   * @throws {NotFoundException} When user is not found
   * @throws {GrpcException} When gRPC service fails
   */
  @ApiOperation({ summary: 'Create new inventory item' })
  @ApiBody({ type: JSON.stringify(InventoryProto.CreateItemDto) })
  @ApiResponse({
    status: 201,
    description: 'Item created successfully',
    type: JSON.stringify(InventoryProto.Item),
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 500, description: 'gRPC service error' })
  @UseGuards(JwtAuthGuard)
  @Post('items')
  public async createItem(
    @CurrentUser() user: UsersProto.User,
    @Body() createItemDto: InventoryProto.CreateItemDto,
  ): Promise<InventoryProto.Item> {
    if (!user.id) {
      throw new NotFoundException('Unauthorized: User not found');
    }

    try {
      const request: InventoryProto.CreateItemRequest = {
        $type: 'api.inventory.CreateItemRequest',
        user: {
          id: user.id,
          email: user.email,
          username: user.username || '',
          $type: 'api.inventory.User',
        },
        item: {
          ...createItemDto,
          $type: 'api.inventory.CreateItemDto',
        },
      };

      return await this.grpcClient.call<InventoryProto.Item>(
        this.inventoryService.createItem(request),
        'Inventory.createItem',
      );
    } catch (error) {
      handleGrpcError(error);
    }
  }

  /**
   * Updates an existing inventory item
   * @param {UsersProto.User} user - The authenticated user
   * @param {string} itemId - The ID of the item to update
   * @param {InventoryProto.CreateItemDto} updateItemDto - Item update data
   * @returns {Promise<InventoryProto.Item>} The updated item
   * @throws {NotFoundException} When user or item is not found
   * @throws {GrpcException} When gRPC service fails
   */
  @ApiOperation({ summary: 'Update inventory item' })
  @ApiParam({ name: 'itemId', type: 'string', description: 'Item ID' })
  @ApiBody({ type: JSON.stringify(InventoryProto.CreateItemDto) })
  @ApiResponse({
    status: 200,
    description: 'Item updated successfully',
    type: JSON.stringify(InventoryProto.Item),
  })
  @ApiResponse({ status: 404, description: 'User or item not found' })
  @ApiResponse({ status: 500, description: 'gRPC service error' })
  @UseGuards(JwtAuthGuard)
  @Patch('items/:itemId')
  public async updateItem(
    @CurrentUser() user: UsersProto.User,
    @Param('itemId') itemId: string,
    @Body() updateItemDto: InventoryProto.CreateItemDto,
  ): Promise<InventoryProto.Item> {
    if (!user.id) {
      throw new NotFoundException('Unauthorized: User not found');
    }

    try {
      const request: InventoryProto.UpdateItemRequest = {
        $type: 'api.inventory.UpdateItemRequest',
        user: {
          id: user.id,
          email: user.email,
          username: user.username || '',
          $type: 'api.inventory.User',
        },
        itemId,
        item: {
          ...updateItemDto,
          $type: 'api.inventory.CreateItemDto',
        },
      };

      return await this.grpcClient.call<InventoryProto.Item>(
        this.inventoryService.updateItem(request),
        'Inventory.updateItem',
      );
    } catch (error) {
      handleGrpcError(error);
    }
  }

  /**
   * Deletes an inventory item
   * @param {UsersProto.User} user - The authenticated user
   * @param {string} itemId - The ID of the item to delete
   * @returns {Promise<InventoryProto.Item>} The deleted item
   * @throws {NotFoundException} When user or item is not found
   * @throws {GrpcException} When gRPC service fails
   */
  @ApiOperation({ summary: 'Delete inventory item' })
  @ApiParam({ name: 'itemId', type: 'string', description: 'Item ID' })
  @ApiResponse({
    status: 200,
    description: 'Item deleted successfully',
    type: JSON.stringify(InventoryProto.Item),
  })
  @ApiResponse({ status: 404, description: 'User or item not found' })
  @ApiResponse({ status: 500, description: 'gRPC service error' })
  @UseGuards(JwtAuthGuard)
  @Delete('items/:itemId')
  public async deleteItem(
    @CurrentUser() user: UsersProto.User,
    @Param('itemId') itemId: string,
  ): Promise<InventoryProto.Item> {
    if (!user.id) {
      throw new NotFoundException('Unauthorized: User not found');
    }

    try {
      const request: InventoryProto.GetItemDetailsRequest = {
        $type: 'api.inventory.GetItemDetailsRequest',
        user: {
          id: user.id,
          email: user.email,
          username: user.username || '',
          $type: 'api.inventory.User',
        },
        itemId,
      };

      return await this.grpcClient.call<InventoryProto.Item>(
        this.inventoryService.deleteItem(request),
        'Inventory.deleteItem',
      );
    } catch (error) {
      handleGrpcError(error);
    }
  }
}
