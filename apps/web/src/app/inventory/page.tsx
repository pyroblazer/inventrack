"use client";

import { useEffect, useState } from "react";
import {
  getAllInventoryItems,
  deleteInventoryItem,
} from "@/actions/inventory/server-actions";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@shared/ui/components/ui/card";
import { Button } from "@shared/ui/components/ui/button";
import { Input } from "@shared/ui/components/ui/input";
import { Badge } from "@shared/ui/components/ui/badge";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Package,
  Filter,
  Download,
  Upload,
} from "lucide-react";
import { toast } from "sonner";
import type { InventoryItem } from "@shared/types";
import { InventoryItemModal } from "@/components/inventory/inventory-item-modal";
import { BulkUploadModal } from "@/components/inventory/bulk-upload-modal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@shared/ui/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@shared/ui/components/ui/alert-dialog";

export default function InventoryPage() {
  // Feature 2: Inventory Management (Admin only)
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [conditionFilter, setConditionFilter] = useState("all");
  const [availabilityFilter, setAvailabilityFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [deleteItem, setDeleteItem] = useState<InventoryItem | null>(null);

  useEffect(() => {
    loadItems();
  }, []);

  useEffect(() => {
    filterItems();
  }, [items, searchTerm, categoryFilter, conditionFilter, availabilityFilter]);

  const loadItems = async () => {
    try {
      setLoading(true);
      const data = await getAllInventoryItems();
      setItems(data);
    } catch (error) {
      toast.error("Failed to load inventory items");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Feature 3a: View available items by category (filtering)
  const filterItems = () => {
    let filtered = items;

    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.category?.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    if (categoryFilter !== "all") {
      filtered = filtered.filter((item) => item.category === categoryFilter);
    }

    if (conditionFilter !== "all") {
      filtered = filtered.filter((item) => item.condition === conditionFilter);
    }

    if (availabilityFilter !== "all") {
      const isAvailable = availabilityFilter === "available";
      filtered = filtered.filter((item) => item.isAvailable === isAvailable);
    }

    setFilteredItems(filtered);
  };

  // Feature 2a: Add/edit/delete items
  const handleEdit = (item: InventoryItem) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  // Feature 2a: Add/edit/delete items
  const handleDelete = async (item: InventoryItem) => {
    try {
      await deleteInventoryItem(item.id);
      toast.success("Item deleted successfully");
      loadItems();
      setDeleteItem(null);
    } catch (error) {
      toast.error("Failed to delete item");
      console.error(error);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    loadItems();
  };

  // Feature 2b: Item details - condition display
  const getConditionColor = (condition?: string) => {
    switch (condition?.toLowerCase()) {
      case "new":
        return "bg-green-100 text-green-800";
      case "good":
        return "bg-blue-100 text-blue-800";
      case "worn":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const categories = [
    ...new Set(items.map((item) => item.category).filter(Boolean)),
  ];

  // Feature 6b: Export usage logs (CSV export)
  const exportData = () => {
    const csv = [
      ["Name", "Category", "Quantity", "Condition", "Available", "Created At"],
      ...filteredItems.map((item) => [
        item.name,
        item.category || "",
        item.quantity.toString(),
        item.condition || "",
        item.isAvailable ? "Yes" : "No",
        new Date(item.createdAt).toLocaleDateString(),
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "inventory-export.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Feature 2: Inventory Management - Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Inventory Management</h1>
          <p className="text-muted-foreground">
            Manage your equipment and supplies
          </p>
        </div>
        <div className="flex gap-2">
          {/* Feature 6b: Export usage logs */}
          <Button variant="outline" onClick={exportData}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          {/* Feature 6a: Bulk item upload (CSV) */}
          <Button variant="outline" onClick={() => setIsBulkUploadOpen(true)}>
            <Upload className="h-4 w-4 mr-2" />
            Bulk Upload
          </Button>
          {/* Feature 2a: Add/edit/delete items */}
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </Button>
        </div>
      </div>

      {/* Feature 2: Inventory Management - Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{items.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available</CardTitle>
            <Package className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {items.filter((item) => item.isAvailable).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unavailable</CardTitle>
            <Package className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {items.filter((item) => !item.isAvailable).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <Filter className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categories.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Feature 3a: View available items by category - Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category!}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={conditionFilter} onValueChange={setConditionFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Condition" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Conditions</SelectItem>
                <SelectItem value="New">New</SelectItem>
                <SelectItem value="Good">Good</SelectItem>
                <SelectItem value="Worn">Worn</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={availabilityFilter}
              onValueChange={setAvailabilityFilter}
            >
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Availability" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Items</SelectItem>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="unavailable">Unavailable</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Feature 2b: Item details - Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredItems.map((item) => (
          <Card key={item.id} className="overflow-hidden">
            <div className="aspect-square bg-muted relative">
              {/* Feature 2b: Item details - photo upload */}
              {item.photoUrl ? (
                <img
                  src={item.photoUrl || "/placeholder.svg"}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <Package className="h-12 w-12 text-muted-foreground" />
                </div>
              )}
              <div className="absolute top-2 right-2">
                {/* Feature 2b: Item details - availability toggle */}
                <Badge variant={item.isAvailable ? "default" : "secondary"}>
                  {item.isAvailable ? "Available" : "Unavailable"}
                </Badge>
              </div>
            </div>
            <CardContent className="p-4">
              <div className="space-y-2">
                {/* Feature 2b: Item details - name, category, quantity, condition */}
                <h3 className="font-semibold truncate">{item.name}</h3>
                {item.category && (
                  <p className="text-sm text-muted-foreground">
                    {item.category}
                  </p>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-sm">Qty: {item.quantity}</span>
                  {item.condition && (
                    <Badge className={getConditionColor(item.condition)}>
                      {item.condition}
                    </Badge>
                  )}
                </div>
                {/* Feature 2a: Add/edit/delete items - Action buttons */}
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(item)}
                    className="flex-1"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setDeleteItem(item)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No items found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm ||
              categoryFilter !== "all" ||
              conditionFilter !== "all" ||
              availabilityFilter !== "all"
                ? "Try adjusting your filters"
                : "Get started by adding your first inventory item"}
            </p>
            {!searchTerm &&
              categoryFilter === "all" &&
              conditionFilter === "all" &&
              availabilityFilter === "all" && (
                <Button onClick={() => setIsModalOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Item
                </Button>
              )}
          </CardContent>
        </Card>
      )}

      {/* Feature 2a: Add/edit/delete items - Modals */}
      <InventoryItemModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        item={editingItem}
      />

      {/* Feature 6a: Bulk item upload (CSV) */}
      <BulkUploadModal
        isOpen={isBulkUploadOpen}
        onClose={() => setIsBulkUploadOpen(false)}
        onSuccess={loadItems}
      />

      {/* Feature 2a: Add/edit/delete items - Delete Confirmation */}
      <AlertDialog open={!!deleteItem} onOpenChange={() => setDeleteItem(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Item</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deleteItem?.name}"? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteItem && handleDelete(deleteItem)}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
