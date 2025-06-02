"use client";

import type React from "react";

import { useState } from "react";
import { createBooking } from "@/actions/booking/server-actions";
import { useCurrentUser } from "@/hooks/use-current-user";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@shared/ui/components/ui/dialog";
import { Button } from "@shared/ui/components/ui/button";
import { Input } from "@shared/ui/components/ui/input";
import { Label } from "@shared/ui/components/ui/label";
import { Textarea } from "@shared/ui/components/ui/textarea";
import { toast } from "sonner";
import { Package, Clock } from "lucide-react";
import type { InventoryItem } from "@shared/types";
import { format, addDays } from "date-fns";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: InventoryItem | null;
}

export function BookingModal({ isOpen, onClose, item }: BookingModalProps) {
  const { user } = useCurrentUser();
  const [formData, setFormData] = useState({
    startDate: format(addDays(new Date(), 1), "yyyy-MM-dd"),
    endDate: format(addDays(new Date(), 2), "yyyy-MM-dd"),
    note: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user || !item) {
      toast.error("User or item not found");
      return;
    }

    if (new Date(formData.startDate) >= new Date(formData.endDate)) {
      toast.error("End date must be after start date");
      return;
    }

    if (new Date(formData.startDate) < new Date()) {
      toast.error("Start date cannot be in the past");
      return;
    }

    try {
      setLoading(true);

      await createBooking({
        itemId: item.id,
        startTime: new Date(formData.startDate),
        endTime: new Date(formData.startDate),
        note: formData.note,
        status: "pending",
      });

      toast.success("Booking request submitted successfully");
      onClose();

      // Reset form
      setFormData({
        startDate: format(addDays(new Date(), 1), "yyyy-MM-dd"),
        endDate: format(addDays(new Date(), 2), "yyyy-MM-dd"),
        note: "",
      });
    } catch (error) {
      toast.error("Failed to submit booking request");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (!item) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Book Item</DialogTitle>
        </DialogHeader>

        {/* Item Details */}
        <div className="bg-muted p-4 rounded-lg space-y-2">
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            <span className="font-medium">{item.name}</span>
          </div>
          {item.category && (
            <p className="text-sm text-muted-foreground">{item.category}</p>
          )}
          <div className="flex items-center gap-4 text-sm">
            <span>Quantity: {item.quantity}</span>
            {item.condition && <span>Condition: {item.condition}</span>}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date *</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => handleInputChange("startDate", e.target.value)}
                min={format(new Date(), "yyyy-MM-dd")}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">End Date *</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => handleInputChange("endDate", e.target.value)}
                min={formData.startDate}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="note">Purpose/Notes</Label>
            <Textarea
              id="note"
              value={formData.note}
              onChange={(e) => handleInputChange("note", e.target.value)}
              placeholder="Describe how you plan to use this item..."
              rows={3}
            />
          </div>

          <div className="bg-blue-50 p-3 rounded-lg text-sm">
            <div className="flex items-center gap-2 text-blue-700 mb-1">
              <Clock className="h-4 w-4" />
              <span className="font-medium">Booking Information</span>
            </div>
            <ul className="text-blue-600 space-y-1">
              <li>
                • Your booking request will be reviewed by an administrator
              </li>
              <li>
                • You'll receive a notification once it's approved or rejected
              </li>
              <li>
                • Please return the item by the end date to avoid penalties
              </li>
            </ul>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Submitting..." : "Submit Request"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
