//apps/web/src/actions/inventory/inventory-service.ts
import { ApiClient } from "@/lib/api-client";
import { getErrorMessage } from "@/lib/get-error-message";
import { type InventoryItem, type InventoryEndpoints } from "@shared/types";

/**
 * Service class for inventory-related API calls
 */
export class InventoryService {
  private static readonly BASE_PATH = "/inventory";

  /**
   * Fetches all available inventory items (admin or public)
   */
  static async getAllItems(): Promise<InventoryItem[]> {
    try {
      const response = await ApiClient.get<
        InventoryEndpoints["getAllItems"]["response"]
      >(`${this.BASE_PATH}/items`);

      if (!response.success) {
        throw new Error("Failed to fetch inventory items");
      }

      return response.data.items;
    } catch (error) {
      console.error("Failed to fetch inventory items:", error);
      throw new Error(getErrorMessage(error));
    }
  }

  /**
   * Fetches inventory items for the current authenticated user
   */
  static async getUserItems(): Promise<InventoryItem[]> {
    try {
      const response = await ApiClient.get<
        InventoryEndpoints["getUserItems"]["response"]
      >(`${this.BASE_PATH}/items/my`);

      if (!response.success) {
        throw new Error("Failed to fetch user inventory items");
      }

      return response.data.items;
    } catch (error) {
      console.error("Failed to fetch user inventory items:", error);
      throw new Error(getErrorMessage(error));
    }
  }

  /**
   * Fetches a single item by ID
   */
  static async getItemById(
    id: string,
  ): Promise<InventoryEndpoints["getItemById"]["response"]> {
    try {
      const response = await ApiClient.get<
        InventoryEndpoints["getItemById"]["response"]
      >(`${this.BASE_PATH}/items/${id}`);

      if (!response.success) {
        throw new Error("Failed to fetch inventory item");
      }

      return response.data;
    } catch (error) {
      console.error(`Failed to fetch item ${id}:`, error);
      throw new Error(getErrorMessage(error));
    }
  }

  /**
   * Creates a new inventory item
   */
  static async createItem(
    request: Readonly<InventoryEndpoints["createItem"]["body"]>,
  ): Promise<InventoryEndpoints["createItem"]["response"]> {
    try {
      const response = await ApiClient.post<
        InventoryEndpoints["createItem"]["body"],
        InventoryEndpoints["createItem"]["response"]
      >(`${this.BASE_PATH}/items`, {
        body: request,
      });

      if (!response.success) {
        throw new Error("Failed to create inventory item");
      }

      return response.data;
    } catch (error) {
      console.error("Failed to create inventory item:", error);
      throw new Error(getErrorMessage(error));
    }
  }

  /**
   * Updates an existing inventory item
   */
  static async updateItem(
    id: string,
    request: Readonly<InventoryEndpoints["updateItem"]["body"]>,
  ): Promise<InventoryEndpoints["updateItem"]["response"]> {
    try {
      const response = await ApiClient.patch<
        InventoryEndpoints["updateItem"]["body"],
        InventoryEndpoints["updateItem"]["response"]
      >(`${this.BASE_PATH}/items/${id}`, {
        body: request,
      });

      if (!response.success) {
        throw new Error("Failed to update inventory item");
      }

      return response.data;
    } catch (error) {
      console.error(`Failed to update inventory item ${id}:`, error);
      throw new Error(getErrorMessage(error));
    }
  }

  /**
   * Deletes an inventory item
   */
  static async deleteItem(
    id: string,
  ): Promise<InventoryEndpoints["deleteItem"]["response"]> {
    try {
      const response = await ApiClient.delete<
        InventoryEndpoints["deleteItem"]["response"]
      >(`${this.BASE_PATH}/items/${id}`);

      if (!response.success) {
        throw new Error("Failed to delete inventory item");
      }

      return response.data;
    } catch (error) {
      console.error(`Failed to delete inventory item ${id}:`, error);
      throw new Error(getErrorMessage(error));
    }
  }
}
