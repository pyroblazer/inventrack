//apps/api/services/inventory-service/src/inventory.controller.ts
import { Controller, Logger } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { InventoryService } from './inventory.service';
import { InventoryProto } from '@microservices/proto';

@Controller()
export class InventoryController {
  private readonly logger = new Logger(InventoryController.name);

  constructor(private readonly inventoryService: InventoryService) {}

  @GrpcMethod('InventoryService', 'GetItemsByUserId')
  async getItemsByUserId(request: InventoryProto.GetItemsRequest) {
    this.logger.log('GetItemsByUserId request received:', request);
    try {
      const userItems = await this.inventoryService.getItemsByUserId(request);
      this.logger.log('GetItemsByUserId response:', {
        itemCount: userItems.items.length,
      });
      return userItems;
    } catch (error) {
      this.logger.error('GetItemsByUserId error:', error);
      throw error;
    }
  }

  @GrpcMethod('InventoryService', 'GetAllItems')
  async getAllItems(request: InventoryProto.GetAllItemsRequest) {
    this.logger.log('GetAllItems request received:', request);
    try {
      const allItems = await this.inventoryService.getAllItems(request);
      this.logger.log('GetAllItems response:', {
        items: allItems.items,
      });
      return allItems;
    } catch (error) {
      this.logger.error('GetAllItems error:', error);
      throw error;
    }
  }

  @GrpcMethod('InventoryService', 'GetItemDetails')
  async getItemDetails(request: InventoryProto.GetItemDetailsRequest) {
    this.logger.log('GetItemDetails request received:', {
      userId: request.user?.id,
      itemId: request.itemId,
    });
    try {
      const itemDetails = await this.inventoryService.getItemDetails(request);
      this.logger.log('GetItemDetails response:', {
        itemId: itemDetails.item?.id,
      });
      return itemDetails;
    } catch (error) {
      this.logger.error('GetItemDetails error:', error);
      throw error;
    }
  }

  @GrpcMethod('InventoryService', 'CreateItem')
  async createItem(request: InventoryProto.CreateItemRequest) {
    this.logger.log('CreateItem request received:', {
      userId: request.user?.id,
      itemName: request.item?.name,
    });
    try {
      const createdItem = await this.inventoryService.createItem(request);
      this.logger.log('CreateItem response:', { itemId: createdItem.id });
      return createdItem;
    } catch (error) {
      this.logger.error('CreateItem error:', error);
      throw error;
    }
  }

  @GrpcMethod('InventoryService', 'UpdateItem')
  async updateItem(request: InventoryProto.UpdateItemRequest) {
    this.logger.log('UpdateItem request received:', {
      userId: request.user?.id,
      itemId: request.itemId,
    });
    try {
      const updatedItem = await this.inventoryService.updateItem(request);
      this.logger.log('UpdateItem response:', { itemId: updatedItem.id });
      return updatedItem;
    } catch (error) {
      this.logger.error('UpdateItem error:', error);
      throw error;
    }
  }

  @GrpcMethod('InventoryService', 'DeleteItem')
  async deleteItem(request: InventoryProto.GetItemDetailsRequest) {
    this.logger.log('DeleteItem request received:', {
      userId: request.user?.id,
      itemId: request.itemId,
    });
    try {
      const deletedItem = await this.inventoryService.deleteItem(request);
      this.logger.log('DeleteItem response:', { itemId: deletedItem.id });
      return deletedItem;
    } catch (error) {
      this.logger.error('DeleteItem error:', error);
      throw error;
    }
  }
}
