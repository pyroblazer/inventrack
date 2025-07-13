//apps/web/src/app/admin/bookings/page.tsx
"use client";

import { useEffect, useState } from "react";
import {
  getAllBookings,
  updateBooking,
} from "@/actions/booking/server-actions";
import { sendNotification } from "@/actions/notification/server-actions";
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
import { useCurrentUser } from "@/hooks/use-current-user";
import { Skeleton } from "@shared/ui/src/components/ui/skeleton";
import { Input } from "@shared/ui/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@shared/ui/components/ui/alert-dialog";

// Helper function to convert ProtoTimestamp to Date
const protoTimestampToDate = (timestamp?: ProtoTimestamp): Date => {
  if (!timestamp) return new Date();
  return new Date(
    (timestamp.seconds || 0) * 1000 + (timestamp.nanos || 0) / 1000000,
  );
};

/**
 * Admin Booking Management Page
 * Features implemented:
 * - Feature 3e: Admin can approve/reject/manage ALL user bookings
 * - Feature 5a: Send notifications to staff when booking status changes
 * - Feature 5b: Admin receives notifications for booking requests
 * - Feature 4b: Track overdue returns
 * - Bulk actions for efficient management
 */
export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBookings, setSelectedBookings] = useState<string[]>([]);
  const { user, isLoading } = useCurrentUser();

  useEffect(() => {
    loadAllBookings();
  }, []);

  useEffect(() => {
    filterBookings();
  }, [bookings, statusFilter, searchTerm]);

  if (isLoading || !user) {
    return <Skeleton className="w-[180px] h-[40px] rounded-md" />;
  }

  // Feature 1b: Role-based access control
  if (user.role !== "ADMIN") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Access Denied</h3>
              <p className="text-muted-foreground">
                You don't have permission to access this page.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Feature 3e: Load ALL bookings for admin management
  const loadAllBookings = async () => {
    try {
      setLoading(true);
      const response = await getAllBookings();
      setBookings(
        (response.bookings || []).map((booking) => ({
          ...booking,
          startTime: booking.startTime
            ? protoTimestampToDate(booking.startTime)
            : undefined,
          endTime: booking.endTime
            ? protoTimestampToDate(booking.endTime)
            : undefined,
          createdAt: booking.createdAt
            ? protoTimestampToDate(booking.createdAt)
            : undefined,
          updatedAt: booking.updatedAt
            ? protoTimestampToDate(booking.updatedAt)
            : undefined,
        })),
      );
    } catch (error) {
      toast.error("Failed to load bookings");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Feature 3e: Filter and search bookings
  const filterBookings = () => {
    let filtered = bookings;

    if (statusFilter !== "all") {
      filtered = filtered.filter((booking) => booking.status === statusFilter);
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (booking) =>
          booking.itemId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          booking.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          booking.note.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // Sort by creation date (newest first), with pending bookings at top
    filtered.sort((a, b) => {
      // Prioritize pending bookings
      if (a.status === "pending" && b.status !== "pending") return -1;
      if (b.status === "pending" && a.status !== "pending") return 1;

      const dateA = a.createdAt ? a.createdAt : new Date(0);
      const dateB = b.createdAt ? b.createdAt : new Date(0);
      return dateB.getTime() - dateA.getTime();
    });

    setFilteredBookings(filtered);
  };

  // Feature 3e & 5a: Update booking status and send notifications
  const handleStatusUpdate = async (
    bookingId: string,
    newStatus: string,
    booking: Booking,
  ) => {
    try {
      await updateBooking(bookingId, {
        itemId: booking.itemId,
        startTime: booking.startTime!,
        endTime: booking.endTime!,
        note: booking.note,
        status: newStatus,
      });

      // Feature 5a: Send notification to staff when booking status changes
      let notificationTitle = "";
      let notificationMessage = "";
      let notificationType = "";

      switch (newStatus) {
        case "approved":
          notificationTitle = "Booking Approved!";
          notificationMessage = `Your booking for item ${booking.itemId} has been approved. You can pick it up on ${booking.startTime ? format(booking.startTime, "MMM dd, yyyy") : "the scheduled date"}.`;
          notificationType = "booking_approved";
          break;
        case "rejected":
          notificationTitle = "Booking Request Declined";
          notificationMessage = `Your booking request for item ${booking.itemId} has been declined. Please contact admin for more information.`;
          notificationType = "booking_rejected";
          break;
        case "returned":
          notificationTitle = "Item Return Confirmed";
          notificationMessage = `Thank you for returning item ${booking.itemId}. The return has been processed successfully.`;
          notificationType = "item_returned";
          break;
      }

      if (notificationTitle) {
        await sendNotification({
          userId: booking.userId,
          title: notificationTitle,
          message: notificationMessage,
          type: notificationType,
        });
      }

      toast.success(`Booking ${newStatus} successfully`);
      loadAllBookings();
    } catch (error) {
      toast.error(`Failed to ${newStatus} booking`);
      console.error(error);
    }
  };

  // Feature 3e: Bulk status update
  const handleBulkStatusUpdate = async (newStatus: string) => {
    try {
      const selectedBookingObjects = bookings.filter((b) =>
        selectedBookings.includes(b.id),
      );

      await Promise.all(
        selectedBookingObjects.map((booking) =>
          handleStatusUpdate(booking.id, newStatus, booking),
        ),
      );

      setSelectedBookings([]);
      toast.success(`${selectedBookings.length} bookings updated successfully`);
    } catch (error) {
      toast.error("Failed to update bookings");
      console.error(error);
    }
  };

  // Feature 3e: Status display
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

  // Feature 4b: Track overdue returns
  const isOverdue = (booking: Booking): boolean => {
    if (booking.status !== "approved" || !booking.endTime) return false;
    return booking.endTime < new Date();
  };

  // Feature 4a,4b: Admin Dashboard - Booking statistics
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
      {/* Feature 3e: Admin Booking Management Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Manage All Bookings</h1>
          <p className="text-muted-foreground">
            Approve, reject, and track all equipment bookings
          </p>
        </div>
      </div>

      {/* Feature 4a,4b: Admin Dashboard - Stats Cards */}
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

      {/* Feature 3e: Filters and Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
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

            <Input
              placeholder="Search by item ID, user ID, or notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />

            {/* Feature 3e: Bulk Actions */}
            {selectedBookings.length > 0 && (
              <div className="flex items-center gap-2 ml-auto">
                <span className="text-sm text-muted-foreground">
                  {selectedBookings.length} selected
                </span>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Bulk Approve
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Approve Selected Bookings
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to approve{" "}
                        {selectedBookings.length} selected booking(s)? This will
                        send notifications to the respective users.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleBulkStatusUpdate("approved")}
                      >
                        Approve All
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <XCircle className="h-4 w-4 mr-2" />
                      Bulk Reject
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Reject Selected Bookings
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to reject{" "}
                        {selectedBookings.length} selected booking(s)? This will
                        send notifications to the respective users.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleBulkStatusUpdate("rejected")}
                      >
                        Reject All
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Feature 3e: Admin Booking Management List */}
      <div className="space-y-4">
        {filteredBookings.map((booking) => (
          <Card
            key={booking.id}
            className={`${isOverdue(booking) ? "border-red-200" : ""}`}
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  {/* Feature 3e: Bulk selection checkbox */}
                  <input
                    type="checkbox"
                    checked={selectedBookings.includes(booking.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedBookings([...selectedBookings, booking.id]);
                      } else {
                        setSelectedBookings(
                          selectedBookings.filter((id) => id !== booking.id),
                        );
                      }
                    }}
                    className="mt-1"
                  />

                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-3 flex-wrap">
                      <div className="flex items-center gap-2">
                        <Package className="h-5 w-5 text-muted-foreground" />
                        <span className="font-semibold">
                          Item Id: {booking.itemId}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Package className="h-5 w-5 text-muted-foreground" />
                        <span className="font-semibold">
                          Item Name: {booking.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">User: {booking.userId}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          User Name: {booking.userName}
                        </span>
                      </div>
                      {/* Feature 3e: Status display */}
                      <Badge className={getStatusColor(booking.status)}>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(booking.status)}
                          {booking.status.toUpperCase()}
                        </div>
                      </Badge>
                      {/* Feature 4b: Track overdue returns */}
                      {isOverdue(booking) && (
                        <Badge variant="destructive">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          OVERDUE
                        </Badge>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">
                          Start Date:
                        </span>
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
                        <span className="text-muted-foreground">
                          Requested:
                        </span>
                        <div className="font-medium">
                          {booking.createdAt
                            ? format(booking.createdAt, "MMM dd, yyyy")
                            : "N/A"}
                        </div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">
                          Last Updated:
                        </span>
                        <div className="font-medium">
                          {booking.updatedAt
                            ? format(booking.updatedAt, "MMM dd, yyyy")
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
                </div>

                {/* Feature 3e: Admin Action Buttons */}
                <div className="ml-4 flex flex-col gap-2">
                  {booking.status === "pending" && (
                    <>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Approve
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Approve Booking</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to approve this booking? The
                              user will be notified.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() =>
                                handleStatusUpdate(
                                  booking.id,
                                  "approved",
                                  booking,
                                )
                              }
                            >
                              Approve
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <XCircle className="h-4 w-4 mr-2" />
                            Reject
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Reject Booking</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to reject this booking? The
                              user will be notified.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() =>
                                handleStatusUpdate(
                                  booking.id,
                                  "rejected",
                                  booking,
                                )
                              }
                            >
                              Reject
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </>
                  )}

                  {booking.status === "approved" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        handleStatusUpdate(booking.id, "returned", booking)
                      }
                    >
                      <Package className="h-4 w-4 mr-2" />
                      Mark Returned
                    </Button>
                  )}

                  {(booking.status === "rejected" ||
                    booking.status === "returned") && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        handleStatusUpdate(booking.id, "pending", booking)
                      }
                    >
                      Reset to Pending
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
            <p className="text-muted-foreground mb-4">
              {statusFilter !== "all"
                ? `No ${statusFilter} bookings found`
                : "No bookings in the system yet"}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
