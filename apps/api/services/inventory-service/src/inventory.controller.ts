//apps/api/services/inventory-service/src/inventory.controller.ts
import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { InventoryService } from './inventory.service';
import { InventoryProto } from '@microservices/proto';

@Controller()
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @GrpcMethod('InventoryService', 'GetItemsByUserId')
  getItemsByUserId(request: InventoryProto.GetItemsRequest) {
    return this.inventoryService.getItemsByUserId(request);
  }

  @GrpcMethod('InventoryService', 'GetItemDetails')
  getItemDetails(request: InventoryProto.GetItemDetailsRequest) {
    return this.inventoryService.getItemDetails(request);
  }

  @GrpcMethod('InventoryService', 'CreateItem')
  createItem(request: InventoryProto.CreateItemRequest) {
    return this.inventoryService.createItem(request);
  }

  @GrpcMethod('InventoryService', 'UpdateItem')
  updateItem(request: InventoryProto.UpdateItemRequest) {
    return this.inventoryService.updateItem(request);
  }

  @GrpcMethod('InventoryService', 'DeleteItem')
  deleteItem(request: InventoryProto.GetItemDetailsRequest) {
    return this.inventoryService.deleteItem(request);
  }
}
