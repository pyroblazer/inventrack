"use client";

import { useEffect, useState } from "react";
import {
  getAllBookings,
  updateBooking,
} from "@/actions/booking/server-actions";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@shared/ui/components/ui/card";
import { Button } from "@shared/ui/components/ui/button";
import { Badge } from "@shared/ui/components/ui/badge";
import {
  Calendar,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  User,
  Filter,
} from "lucide-react";
import { toast } from "sonner";
import type { Booking, ProtoTimestamp } from "@shared/types";
import { format } from "date-fns";
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

// Helper function to convert ProtoTimestamp to Date
// const protoTimestampToDate = (timestamp?: ProtoTimestamp): Date => {
//   if (!timestamp) return new Date()
//   return new Date((timestamp.seconds || 0) * 1000 + (timestamp.nanos || 0) / 1000000)
// }

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [actionBooking, setActionBooking] = useState<{
    booking: Booking;
    action: "approve" | "reject";
  } | null>(null);

  useEffect(() => {
    loadBookings();
  }, []);

  useEffect(() => {
    filterBookings();
  }, [bookings, statusFilter]);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const data = await getAllBookings();
      setBookings(data);
    } catch (error) {
      toast.error("Failed to load bookings");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filterBookings = () => {
    let filtered = bookings;

    if (statusFilter !== "all") {
      filtered = filtered.filter((booking) => booking.status === statusFilter);
    }

    // Sort by creation date (newest first)
    filtered.sort((a, b) => {
      const dateA: Date = a.createdAt ? new Date(a.createdAt) : new Date(0);
      const dateB: Date = b.createdAt ? new Date(b.createdAt) : new Date(0);
      return dateB.getTime() - dateA.getTime();
    });

    setFilteredBookings(filtered);
  };

  const handleBookingAction = async (
    booking: Booking,
    action: "approve" | "reject",
  ) => {
    try {
      const newStatus = action === "approve" ? "approved" : "rejected";

      await updateBooking(booking.id, {
        user: { id: booking.userId, email: "", username: "", role: "staff" }, // Minimal user object
        bookingId: booking.id,
        booking: {
          itemId: booking.itemId,
          startTime: booking.startTime!,
          endTime: booking.endTime!,
          note: booking.note,
          status: newStatus,
        },
      });

      toast.success(`Booking ${action}d successfully`);
      loadBookings();
      setActionBooking(null);
    } catch (error) {
      toast.error(`Failed to ${action} booking`);
      console.error(error);
    }
  };

  const getStatusColor = (status: string): string => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "returned":
        return "bg-blue-100 text-blue-800";
      case "cancelled":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "approved":
        return <CheckCircle className="h-4 w-4" />;
      case "rejected":
        return <XCircle className="h-4 w-4" />;
      case "returned":
        return <Package className="h-4 w-4" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const isOverdue = (booking: Booking): boolean => {
    if (booking.status !== "approved" || !booking.endTime) return false;
    return booking.endTime < new Date();
  };

  const getBookingStats = () => {
    const pending = bookings.filter((b) => b.status === "pending").length;
    const approved = bookings.filter((b) => b.status === "approved").length;
    const returned = bookings.filter((b) => b.status === "returned").length;
    const overdue = bookings.filter((b) => isOverdue(b)).length;

    return { pending, approved, returned, overdue, total: bookings.length };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const stats = getBookingStats();

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Manage Bookings</h1>
          <p className="text-muted-foreground">
            Review and approve booking requests
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {stats.pending}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.approved}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Returned</CardTitle>
            <Package className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {stats.returned}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {stats.overdue}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Bookings</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="returned">Returned</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Bookings List */}
      <div className="space-y-4">
        {filteredBookings.map((booking) => (
          <Card
            key={booking.id}
            className={`${isOverdue(booking) ? "border-red-200 bg-red-50" : ""}`}
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <Package className="h-5 w-5 text-muted-foreground" />
                      <span className="font-semibold">
                        Item ID: {booking.itemId}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">User: {booking.userId}</span>
                    </div>
                    <Badge className={getStatusColor(booking.status)}>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(booking.status)}
                        {booking.status.toUpperCase()}
                      </div>
                    </Badge>
                    {isOverdue(booking) && (
                      <Badge variant="destructive">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        OVERDUE
                      </Badge>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Start Date:</span>
                      <div className="font-medium">
                        {booking.startTime
                          ? format(booking.startTime, "MMM dd, yyyy")
                          : "N/A"}
                      </div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">End Date:</span>
                      <div className="font-medium">
                        {booking.endTime
                          ? format(booking.endTime, "MMM dd, yyyy")
                          : "N/A"}
                      </div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Requested:</span>
                      <div className="font-medium">
                        {booking.createdAt
                          ? format(booking.createdAt, "MMM dd, yyyy")
                          : "N/A"}
                      </div>
                    </div>
                  </div>

                  {booking.note && (
                    <div className="mt-3">
                      <span className="text-muted-foreground text-sm">
                        Purpose:
                      </span>
                      <p className="text-sm mt-1 p-2 bg-muted rounded">
                        {booking.note}
                      </p>
                    </div>
                  )}
                </div>

                <div className="ml-4 flex gap-2">
                  {booking.status === "pending" && (
                    <>
                      <Button
                        size="sm"
                        onClick={() =>
                          setActionBooking({ booking, action: "approve" })
                        }
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setActionBooking({ booking, action: "reject" })
                        }
                        className="text-red-600 hover:text-red-700"
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                    </>
                  )}
                  {booking.status === "approved" && (
                    <Button variant="outline" size="sm">
                      Mark as Returned
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredBookings.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No bookings found</h3>
            <p className="text-muted-foreground">
              {statusFilter !== "all"
                ? `No ${statusFilter} bookings found`
                : "No booking requests have been made yet"}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Action Confirmation Dialog */}
      <AlertDialog
        open={!!actionBooking}
        onOpenChange={() => setActionBooking(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {actionBooking?.action === "approve" ? "Approve" : "Reject"}{" "}
              Booking
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to {actionBooking?.action} this booking
              request for Item ID: {actionBooking?.booking.itemId}?
              {actionBooking?.action === "reject" &&
                " This action will notify the user that their request was denied."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                actionBooking &&
                handleBookingAction(actionBooking.booking, actionBooking.action)
              }
              className={
                actionBooking?.action === "approve"
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-red-600 hover:bg-red-700"
              }
            >
              {actionBooking?.action === "approve" ? "Approve" : "Reject"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
