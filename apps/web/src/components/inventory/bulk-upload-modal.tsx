"use client";

import { useState } from "react";
import { createInventoryItem } from "@/actions/inventory/server-actions";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@shared/ui/components/ui/dialog";
import { Button } from "@shared/ui/components/ui/button";
import { Label } from "@shared/ui/components/ui/label";
import { Textarea } from "@shared/ui/components/ui/textarea";
import { toast } from "sonner";
import { Upload, Download, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@shared/ui/components/ui/alert";

interface BulkUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function BulkUploadModal({
  isOpen,
  onClose,
  onSuccess,
}: BulkUploadModalProps) {
  const [csvData, setCsvData] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const downloadTemplate = () => {
    const template = [
      "name,category,quantity,condition,photoUrl,isAvailable",
      "Laptop Dell XPS,Electronics,5,New,https://example.com/laptop.jpg,true",
      "Office Chair,Furniture,10,Good,,true",
      "Projector,Electronics,2,Good,https://example.com/projector.jpg,false",
    ].join("\n");

    const blob = new Blob([template], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "inventory-template.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const parseCsvData = (csv: string) => {
    const lines = csv.trim().split("\n");
    if (lines.length < 2) {
      throw new Error("CSV must have at least a header and one data row");
    }

    const headers = lines[0]!.split(",").map((h) => h.trim());
    const requiredHeaders = [
      "name",
      "category",
      "quantity",
      "condition",
      "photoUrl",
      "isAvailable",
    ];

    // Check if all required headers are present
    const missingHeaders = requiredHeaders.filter((h) => !headers.includes(h));
    if (missingHeaders.length > 0) {
      throw new Error(`Missing required headers: ${missingHeaders.join(", ")}`);
    }

    const items = [];
    const parseErrors = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i]!.split(",").map((v) => v.trim());

      if (values.length !== headers.length) {
        parseErrors.push(`Row ${i + 1}: Column count mismatch`);
        continue;
      }

      const item: any = {};
      headers.forEach((header, index) => {
        item[header] = values[index];
      });

      // Validate and convert data types
      if (!item.name) {
        parseErrors.push(`Row ${i + 1}: Name is required`);
        continue;
      }

      item.quantity = Number.parseInt(item.quantity) || 0;
      if (item.quantity < 0) {
        parseErrors.push(`Row ${i + 1}: Quantity must be non-negative`);
        continue;
      }

      item.isAvailable = item.isAvailable.toLowerCase() === "true";

      if (item.condition && !["New", "Good", "Worn"].includes(item.condition)) {
        parseErrors.push(`Row ${i + 1}: Condition must be New, Good, or Worn`);
        continue;
      }

      items.push({
        name: item.name,
        category: item.category || undefined,
        quantity: item.quantity,
        condition: item.condition || undefined,
        photoUrl: item.photoUrl || undefined,
        isAvailable: item.isAvailable,
      });
    }

    if (parseErrors.length > 0) {
      throw new Error(`Parsing errors:\n${parseErrors.join("\n")}`);
    }

    return items;
  };

  const handleUpload = async () => {
    if (!csvData.trim()) {
      toast.error("Please enter CSV data");
      return;
    }

    try {
      setLoading(true);
      setErrors([]);

      const items = parseCsvData(csvData);

      // Upload items one by one
      const results = [];
      for (const item of items) {
        try {
          await createInventoryItem(item);
          results.push({ success: true, item: item.name });
        } catch (error) {
          results.push({
            success: false,
            item: item.name,
            error: error instanceof Error ? error.message : String(error),
          });
        }
      }

      const successful = results.filter((r) => r.success).length;
      const failed = results.filter((r) => !r.success);

      if (failed.length > 0) {
        setErrors(failed.map((f) => `${f.item}: ${f.error}`));
        toast.error(`${successful} items uploaded, ${failed.length} failed`);
      } else {
        toast.success(`Successfully uploaded ${successful} items`);
        onSuccess();
        onClose();
        setCsvData("");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to parse CSV data";
      toast.error(errorMessage);
      setErrors([errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setCsvData("");
    setErrors([]);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Bulk Upload Items</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>CSV Data</Label>
            <Button variant="outline" size="sm" onClick={downloadTemplate}>
              <Download className="h-4 w-4 mr-2" />
              Download Template
            </Button>
          </div>

          <Textarea
            value={csvData}
            onChange={(e) => setCsvData(e.target.value)}
            placeholder="Paste your CSV data here or download the template to get started..."
            className="min-h-48 font-mono text-sm"
          />

          <div className="text-sm text-muted-foreground">
            <p>
              <strong>Required columns:</strong> name, category, quantity,
              condition, photoUrl, isAvailable
            </p>
            <p>
              <strong>Conditions:</strong> New, Good, Worn
            </p>
            <p>
              <strong>isAvailable:</strong> true or false
            </p>
          </div>

          {errors.length > 0 && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-1">
                  {errors.map((error, index) => (
                    <div key={index} className="text-sm">
                      {error}
                    </div>
                  ))}
                </div>
              </AlertDescription>
            </Alert>
          )}

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              onClick={handleUpload}
              disabled={loading || !csvData.trim()}
            >
              {loading ? (
                <>Uploading...</>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Items
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
