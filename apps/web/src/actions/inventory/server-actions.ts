//apps/web/src/actions/inventory/server-actions.ts
"use server";

import { InventoryService } from "@/actions/inventory/inventory-service";
import { type InventoryItem, type InventoryEndpoints } from "@shared/types";

/**
 * Fetches all inventory items
 */
export async function getAllInventoryItems(): Promise<InventoryItem[]> {
  return InventoryService.getAllItems();
}

/**
 * Fetches inventory items for the current authenticated user
 */
export async function getUserInventoryItems(): Promise<InventoryItem[]> {
  return InventoryService.getUserItems();
}

/**
 * Fetches a single inventory item by ID
 */
export async function getInventoryItemById(
  id: string,
): Promise<InventoryEndpoints["getItemById"]["response"]> {
  return InventoryService.getItemById(id);
}

/**
 * Creates a new inventory item
 */
export async function createInventoryItem(
  request: Readonly<InventoryEndpoints["createItem"]["body"]>,
): Promise<InventoryEndpoints["createItem"]["response"]> {
  return InventoryService.createItem(request);
}

/**
 * Updates an inventory item
 */
export async function updateInventoryItem(
  id: string,
  request: Readonly<InventoryEndpoints["updateItem"]["body"]>,
): Promise<InventoryEndpoints["updateItem"]["response"]> {
  return InventoryService.updateItem(id, request);
}

/**
 * Deletes an inventory item
 */
export async function deleteInventoryItem(
  id: string,
): Promise<InventoryEndpoints["deleteItem"]["response"]> {
  return InventoryService.deleteItem(id);
}
