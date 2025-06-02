"use client";

import type React from "react";

import { useState, useEffect } from "react";
import {
  createInventoryItem,
  updateInventoryItem,
} from "@/actions/inventory/server-actions";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@shared/ui/components/ui/dialog";
import { Button } from "@shared/ui/components/ui/button";
import { Input } from "@shared/ui/components/ui/input";
import { Label } from "@shared/ui/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@shared/ui/components/ui/select";
import { Switch } from "@shared/ui/components/ui/switch";
import { toast } from "sonner";
import type { InventoryItem } from "@shared/types";

interface InventoryItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  item?: InventoryItem | null;
}

export function InventoryItemModal({
  isOpen,
  onClose,
  item,
}: InventoryItemModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    quantity: 1,
    condition: "New",
    photoUrl: "",
    isAvailable: true,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name,
        category: item.category || "",
        quantity: item.quantity,
        condition: item.condition || "New",
        photoUrl: item.photoUrl || "",
        isAvailable: item.isAvailable,
      });
    } else {
      setFormData({
        name: "",
        category: "",
        quantity: 1,
        condition: "New",
        photoUrl: "",
        isAvailable: true,
      });
    }
  }, [item, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Item name is required");
      return;
    }

    try {
      setLoading(true);

      if (item) {
        await updateInventoryItem(item.id, formData);
        toast.success("Item updated successfully");
      } else {
        await createInventoryItem(formData);
        toast.success("Item created successfully");
      }

      onClose();
    } catch (error) {
      toast.error(item ? "Failed to update item" : "Failed to create item");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{item ? "Edit Item" : "Add New Item"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Item Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="Enter item name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Input
              id="category"
              value={formData.category}
              onChange={(e) => handleInputChange("category", e.target.value)}
              placeholder="e.g., Electronics, Tools, Furniture"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                min="0"
                value={formData.quantity}
                onChange={(e) =>
                  handleInputChange(
                    "quantity",
                    Number.parseInt(e.target.value) || 0,
                  )
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="condition">Condition</Label>
              <Select
                value={formData.condition}
                onValueChange={(value) => handleInputChange("condition", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="New">New</SelectItem>
                  <SelectItem value="Good">Good</SelectItem>
                  <SelectItem value="Worn">Worn</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="photoUrl">Photo URL</Label>
            <Input
              id="photoUrl"
              value={formData.photoUrl}
              onChange={(e) => handleInputChange("photoUrl", e.target.value)}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="isAvailable"
              checked={formData.isAvailable}
              onCheckedChange={(checked) =>
                handleInputChange("isAvailable", checked)
              }
            />
            <Label htmlFor="isAvailable">Available for booking</Label>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : item ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
