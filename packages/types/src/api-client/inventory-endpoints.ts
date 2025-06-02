/**
 * Represents a single inventory item in the system.
 */
export interface InventoryItem {
  id: string;
  name: string;
  category?: string;
  quantity: number;
  condition?: string;
  photoUrl?: string;
  isAvailable: boolean;
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
  userId: string; // Added userId field
}

/**
 * Inventory API client endpoints and their expected request/response types.
 */

export interface InventoryEndpoints {
  getAllItems: {
    response: {
      items: InventoryItem[];
    };
  };

  getUserItems: {
    response: {
      items: InventoryItem[];
    };
  };

  getItemById: {
    params: {
      id: string;
    };
    response: InventoryItem;
  };

  createItem: {
    body: {
      name: string;
      category?: string;
      quantity: number;
      condition?: string;
      photoUrl?: string;
      isAvailable?: boolean;
    };
    response: InventoryItem;
  };

  updateItem: {
    params: {
      id: string;
    };
    body: {
      name?: string;
      category?: string;
      quantity?: number;
      condition?: string;
      photoUrl?: string;
      isAvailable?: boolean;
    };
    response: InventoryItem;
  };

  deleteItem: {
    params: {
      id: string;
    };
    response: {
      id: string;
      success: boolean;
    };
  };
}
