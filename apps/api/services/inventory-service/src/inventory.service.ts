import { status } from '@grpc/grpc-js';
import {
  and,
  eq,
  type NeonDatabaseType,
  inventoryItems,
  type InventoryItem,
  type NewInventoryItem,
} from '@microservices/database';
import { InventoryProto } from '@microservices/proto';
import { Inject, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class InventoryService {
  constructor(
    @Inject('DATABASE_CONNECTION')
    private readonly database: NeonDatabaseType,
  ) {}

  public async getItemsByUserId(
    request: InventoryProto.GetItemsRequest,
  ): Promise<InventoryProto.GetItemsResponse> {
    try {
      if (!request.user) {
        throw new RpcException({
          code: status.INVALID_ARGUMENT,
          message: 'User is required',
        });
      }

      const items = await this.database
        .select()
        .from(inventoryItems)
        .where(eq(inventoryItems.userId, request.user.id));

      const mappedItems: InventoryProto.Item[] = items.map((item) => ({
        $type: 'api.inventory.Item',
        id: item.id,
        name: item.name,
        category: item.category ?? '',
        quantity: item.quantity,
        condition: item.condition ?? '',
        photoUrl: item.photoUrl ?? '',
        isAvailable: item.isAvailable ?? false,
        createdAt: item.createdAt
          ? {
              $type: 'google.protobuf.Timestamp',
              seconds: Math.floor(item.createdAt.getTime() / 1000),
              nanos: (item.createdAt.getTime() % 1000) * 1000000,
            }
          : undefined,
        updatedAt: item.updatedAt
          ? {
              $type: 'google.protobuf.Timestamp',
              seconds: Math.floor(item.updatedAt.getTime() / 1000),
              nanos: (item.updatedAt.getTime() % 1000) * 1000000,
            }
          : undefined,
        userId: item.userId,
      }));

      return {
        $type: 'api.inventory.GetItemsResponse',
        items: mappedItems,
      };
    } catch (error) {
      console.error('[ERROR] Error in getItemsByUserId function:', error);
      if (error instanceof RpcException) throw error;
      throw new RpcException({
        code: status.INTERNAL,
        message: error instanceof Error ? error.message : 'Internal error',
      });
    }
  }

  public async getAllItems(
    request: InventoryProto.GetAllItemsRequest,
  ): Promise<InventoryProto.GetItemsResponse> {
    try {
      const items = await this.database.select().from(inventoryItems);

      const mappedItems: InventoryProto.Item[] = items.map((item) => ({
        $type: 'api.inventory.Item',
        id: item.id,
        name: item.name,
        category: item.category ?? '',
        quantity: item.quantity,
        condition: item.condition ?? '',
        photoUrl: item.photoUrl ?? '',
        isAvailable: item.isAvailable ?? false,
        createdAt: item.createdAt
          ? {
              $type: 'google.protobuf.Timestamp',
              seconds: Math.floor(item.createdAt.getTime() / 1000),
              nanos: (item.createdAt.getTime() % 1000) * 1000000,
            }
          : undefined,
        updatedAt: item.updatedAt
          ? {
              $type: 'google.protobuf.Timestamp',
              seconds: Math.floor(item.updatedAt.getTime() / 1000),
              nanos: (item.updatedAt.getTime() % 1000) * 1000000,
            }
          : undefined,
        userId: item.userId,
      }));

      return {
        $type: 'api.inventory.GetItemsResponse',
        items: mappedItems,
      };
    } catch (error) {
      console.error('[ERROR] Error in getAllItems function:', error);
      if (error instanceof RpcException) throw error;
      throw new RpcException({
        code: status.INTERNAL,
        message: error instanceof Error ? error.message : 'Internal error',
      });
    }
  }

  public async getItemDetails(
    request: InventoryProto.GetItemDetailsRequest,
  ): Promise<InventoryProto.ItemDetails> {
    try {
      if (!request.user) {
        throw new RpcException({
          code: status.INVALID_ARGUMENT,
          message: 'User is required',
        });
      }

      const [item] = await this.database
        .select()
        .from(inventoryItems)
        .where(
          and(
            eq(inventoryItems.id, request.itemId),
            eq(inventoryItems.userId, request.user.id),
          ),
        );

      if (!item) {
        throw new RpcException({
          code: status.NOT_FOUND,
          message: 'Item not found',
        });
      }

      const mappedItem: InventoryProto.Item = {
        $type: 'api.inventory.Item',
        id: item.id,
        name: item.name,
        category: item.category ?? '',
        quantity: item.quantity,
        condition: item.condition ?? '',
        photoUrl: item.photoUrl ?? '',
        isAvailable: item.isAvailable ?? false,
        createdAt: item.createdAt
          ? {
              $type: 'google.protobuf.Timestamp',
              seconds: Math.floor(item.createdAt.getTime() / 1000),
              nanos: (item.createdAt.getTime() % 1000) * 1000000,
            }
          : undefined,
        updatedAt: item.updatedAt
          ? {
              $type: 'google.protobuf.Timestamp',
              seconds: Math.floor(item.updatedAt.getTime() / 1000),
              nanos: (item.updatedAt.getTime() % 1000) * 1000000,
            }
          : undefined,
        userId: item.userId,
      };

      return {
        $type: 'api.inventory.ItemDetails',
        item: mappedItem,
      };
    } catch (error) {
      console.error('[ERROR] Error in getItemDetails function:', error);
      if (error instanceof RpcException) throw error;
      throw new RpcException({
        code: status.INTERNAL,
        message: error instanceof Error ? error.message : 'Internal error',
      });
    }
  }

  public async createItem(
    request: InventoryProto.CreateItemRequest,
  ): Promise<InventoryProto.Item> {
    try {
      if (!request.user) {
        throw new RpcException({
          code: status.INVALID_ARGUMENT,
          message: 'User is required',
        });
      }

      if (!request.item) {
        throw new RpcException({
          code: status.INVALID_ARGUMENT,
          message: 'Item data is required',
        });
      }

      const newItemData: NewInventoryItem = {
        name: request.item.name,
        category: request.item.category,
        quantity: request.item.quantity,
        condition: request.item.condition,
        photoUrl: request.item.photoUrl,
        isAvailable: request.item.isAvailable,
        userId: request.user.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const [newItem] = await this.database
        .insert(inventoryItems)
        .values(newItemData)
        .returning();

      if (!newItem) {
        throw new RpcException({
          code: status.INTERNAL,
          message: 'Failed to create item',
        });
      }

      return {
        $type: 'api.inventory.Item',
        id: newItem.id,
        name: newItem.name,
        category: newItem.category ?? '',
        quantity: newItem.quantity,
        condition: newItem.condition ?? '',
        photoUrl: newItem.photoUrl ?? '',
        isAvailable: newItem.isAvailable ?? false,
        createdAt: newItem.createdAt
          ? {
              $type: 'google.protobuf.Timestamp',
              seconds: Math.floor(newItem.createdAt.getTime() / 1000),
              nanos: (newItem.createdAt.getTime() % 1000) * 1000000,
            }
          : undefined,
        updatedAt: newItem.updatedAt
          ? {
              $type: 'google.protobuf.Timestamp',
              seconds: Math.floor(newItem.updatedAt.getTime() / 1000),
              nanos: (newItem.updatedAt.getTime() % 1000) * 1000000,
            }
          : undefined,
        userId: newItem.userId,
      };
    } catch (error) {
      console.error('[ERROR] Error in createItem function:', error);
      if (error instanceof RpcException) throw error;
      throw new RpcException({
        code: status.INTERNAL,
        message: error instanceof Error ? error.message : 'Internal error',
      });
    }
  }

  public async updateItem(
    request: InventoryProto.UpdateItemRequest,
  ): Promise<InventoryProto.Item> {
    try {
      if (!request.user) {
        throw new RpcException({
          code: status.INVALID_ARGUMENT,
          message: 'User is required',
        });
      }

      if (!request.item) {
        throw new RpcException({
          code: status.INVALID_ARGUMENT,
          message: 'Item data is required',
        });
      }

      // First check if item exists and belongs to user
      const [existingItem] = await this.database
        .select()
        .from(inventoryItems)
        .where(
          and(
            eq(inventoryItems.id, request.itemId),
            eq(inventoryItems.userId, request.user.id),
          ),
        );

      if (!existingItem) {
        throw new RpcException({
          code: status.NOT_FOUND,
          message: 'Item not found',
        });
      }

      const updateData: Partial<InventoryItem> = {
        name: request.item.name,
        category: request.item.category,
        quantity: request.item.quantity,
        condition: request.item.condition,
        photoUrl: request.item.photoUrl,
        isAvailable: request.item.isAvailable,
        updatedAt: new Date(),
      };

      const [updatedItem] = await this.database
        .update(inventoryItems)
        .set(updateData)
        .where(
          and(
            eq(inventoryItems.id, request.itemId),
            eq(inventoryItems.userId, request.user.id),
          ),
        )
        .returning();

      if (!updatedItem) {
        throw new RpcException({
          code: status.INTERNAL,
          message: 'Failed to update item',
        });
      }

      return {
        $type: 'api.inventory.Item',
        id: updatedItem.id,
        name: updatedItem.name,
        category: updatedItem.category ?? '',
        quantity: updatedItem.quantity,
        condition: updatedItem.condition ?? '',
        photoUrl: updatedItem.photoUrl ?? '',
        isAvailable: updatedItem.isAvailable ?? false,
        createdAt: updatedItem.createdAt
          ? {
              $type: 'google.protobuf.Timestamp',
              seconds: Math.floor(updatedItem.createdAt.getTime() / 1000),
              nanos: (updatedItem.createdAt.getTime() % 1000) * 1000000,
            }
          : undefined,
        updatedAt: updatedItem.updatedAt
          ? {
              $type: 'google.protobuf.Timestamp',
              seconds: Math.floor(updatedItem.updatedAt.getTime() / 1000),
              nanos: (updatedItem.updatedAt.getTime() % 1000) * 1000000,
            }
          : undefined,
        userId: updatedItem.userId,
      };
    } catch (error) {
      console.error('[ERROR] Error in updateItem function:', error);
      if (error instanceof RpcException) throw error;
      throw new RpcException({
        code: status.INTERNAL,
        message: error instanceof Error ? error.message : 'Internal error',
      });
    }
  }

  public async deleteItem(
    request: InventoryProto.GetItemDetailsRequest,
  ): Promise<InventoryProto.Item> {
    try {
      if (!request.user) {
        throw new RpcException({
          code: status.INVALID_ARGUMENT,
          message: 'User is required',
        });
      }

      // First get the item to return it
      const [existingItem] = await this.database
        .select()
        .from(inventoryItems)
        .where(
          and(
            eq(inventoryItems.id, request.itemId),
            eq(inventoryItems.userId, request.user.id),
          ),
        );

      if (!existingItem) {
        throw new RpcException({
          code: status.NOT_FOUND,
          message: 'Item not found',
        });
      }

      // Delete the item
      const [deletedItem] = await this.database
        .delete(inventoryItems)
        .where(
          and(
            eq(inventoryItems.id, request.itemId),
            eq(inventoryItems.userId, request.user.id),
          ),
        )
        .returning();

      if (!deletedItem) {
        throw new RpcException({
          code: status.INTERNAL,
          message: 'Failed to delete item',
        });
      }

      return {
        $type: 'api.inventory.Item',
        id: deletedItem.id,
        name: deletedItem.name,
        category: deletedItem.category ?? '',
        quantity: deletedItem.quantity,
        condition: deletedItem.condition ?? '',
        photoUrl: deletedItem.photoUrl ?? '',
        isAvailable: deletedItem.isAvailable ?? false,
        createdAt: deletedItem.createdAt
          ? {
              $type: 'google.protobuf.Timestamp',
              seconds: Math.floor(deletedItem.createdAt.getTime() / 1000),
              nanos: (deletedItem.createdAt.getTime() % 1000) * 1000000,
            }
          : undefined,
        updatedAt: deletedItem.updatedAt
          ? {
              $type: 'google.protobuf.Timestamp',
              seconds: Math.floor(deletedItem.updatedAt.getTime() / 1000),
              nanos: (deletedItem.updatedAt.getTime() % 1000) * 1000000,
            }
          : undefined,
        userId: deletedItem.userId,
      };
    } catch (error) {
      console.error('[ERROR] Error in deleteItem function:', error);
      if (error instanceof RpcException) throw error;
      throw new RpcException({
        code: status.INTERNAL,
        message: error instanceof Error ? error.message : 'Internal error',
      });
    }
  }
}
