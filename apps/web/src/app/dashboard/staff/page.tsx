"use client";

import { useEffect, useState } from "react";
import { getMyBookings } from "@/actions/booking/server-actions";
import { useCurrentUser } from "@/hooks/use-current-user";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@shared/ui/components/ui/card";
import {
  Calendar,
  Package,
  Clock,
  CheckCircle,
  TrendingUp,
} from "lucide-react";
import { format } from "date-fns";
import type { Booking, ProtoTimestamp } from "@shared/types";
import { useSearchParams } from "next/navigation";
import { Badge } from "@shared/ui/components/ui/badge";
import { Button } from "@shared/ui/components/ui/button";

// Type definitions for dashboard data
interface StaffDashboardData {
  history: {
    bookingId: string;
    itemId: string;
    status: string;
    startDate: string;
    endDate: string;
  }[];
}

interface BookingStats {
  pending: number;
  approved: number;
  returned: number;
  overdue: number;
  total: number;
}

// Helper function to convert ProtoTimestamp to Date
const protoTimestampToDate = (timestamp?: ProtoTimestamp): Date => {
  if (!timestamp) return new Date();
  return new Date(
    (timestamp.seconds || 0) * 1000 + (timestamp.nanos || 0) / 1000000,
  );
};

/**
 * StaffDashboard component
 * Features implemented:
 * - Feature 4f: Staff Dashboard - View personal booking history
 * - Feature 4g: Staff Dashboard - Status of pending/approved requests
 * - Feature 4h: Staff Dashboard - Personal booking statistics
 * - Bonus: Admin/Staff mode switcher support (when admin views staff mode)
 */
export default function StaffDashboard() {
  const { user, isLoading: userLoading } = useCurrentUser();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [dashboardData, setDashboardData] = useState<StaffDashboardData | null>(
    null,
  );
  const [loading, setLoading] = useState(true);

  const searchParams = useSearchParams();
  const currentMode = searchParams.get("mode") || "STAFF";

  useEffect(() => {
    console.log("dashboard staff page user", user);
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const [myBookingsResponse] = await Promise.all([getMyBookings()]);

      console.log(
        "dashboard staff page myBookingsResponse",
        myBookingsResponse,
      );

      // Feature 4f,g,h: Extract bookings array and convert timestamps
      setBookings(
        (myBookingsResponse.bookings || []).map((booking) => ({
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
      console.error("Failed to load staff dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  // Feature 4f,g,h: Staff Dashboard - Personal booking statistics
  const getBookingStats = (): BookingStats => {
    const pending = bookings.filter((b) => b.status === "pending").length;
    const approved = bookings.filter((b) => b.status === "approved").length;
    const returned = bookings.filter((b) => b.status === "returned").length;
    const overdue = bookings.filter(
      (b) => b.status === "approved" && b.endTime && b.endTime < new Date(),
    ).length;

    return { pending, approved, returned, overdue, total: bookings.length };
  };

  // Feature 4f,g,h: Status color coding
  const getStatusColor = (status: string): string => {
    switch (status.toLowerCase()) {
      case "pending":
        return "text-yellow-600 bg-yellow-100";
      case "approved":
        return "text-green-600 bg-green-100";
      case "rejected":
        return "text-red-600 bg-red-100";
      case "returned":
        return "text-blue-600 bg-blue-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  if (userLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const stats = getBookingStats();

  return (
    <div className="space-y-6 p-6">
      {/* Header with mode indicator */}
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold">My Dashboard</h1>
            {/* Bonus: Mode indicator for admin users */}
            {user?.role === "ADMIN" && (
              <Badge
                variant={currentMode === "STAFF" ? "secondary" : "default"}
              >
                {currentMode === "STAFF" ? "Staff View" : "Admin View"}
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground">
            Welcome back, {user?.username || user?.email}
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => (window.location.href = "/browse")}>
            Browse Items
          </Button>
          <Button
            variant="outline"
            onClick={() => (window.location.href = "/bookings")}
          >
            View All Bookings
          </Button>
        </div>
      </div>

      {/* Feature 4f,g,h: Staff Dashboard - Personal booking statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Bookings
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">All time bookings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {stats.pending}
            </div>
            <p className="text-xs text-muted-foreground">Awaiting approval</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.approved}
            </div>
            <p className="text-xs text-muted-foreground">Currently borrowed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {stats.returned}
            </div>
            <p className="text-xs text-muted-foreground">
              Successfully returned
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Feature 4f: Staff Dashboard - View personal booking history */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            My Recent Bookings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {bookings.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium mb-2">No bookings yet</p>
                <p className="mb-4">Start by browsing available items!</p>
                <Button onClick={() => (window.location.href = "/browse")}>
                  Browse Equipment
                </Button>
              </div>
            ) : (
              bookings.slice(0, 10).map((booking) => (
                <div
                  key={booking.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="font-medium">Item ID: {booking.itemId}</div>
                    <div className="font-medium">
                      Item Name: {booking.itemName}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {booking.startTime && booking.endTime && (
                        <>
                          {format(booking.startTime, "MMM dd")} -{" "}
                          {format(booking.endTime, "MMM dd, yyyy")}
                        </>
                      )}
                    </div>
                    {booking.note && (
                      <div className="text-sm text-muted-foreground mt-1">
                        Purpose: {booking.note}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-4">
                    {/* Feature 4g: Status of pending/approved requests */}
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}
                    >
                      {booking.status.toUpperCase()}
                    </span>
                    <div className="text-sm text-muted-foreground">
                      {booking.createdAt && format(booking.createdAt, "MMM dd")}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              className="w-full justify-start"
              variant="outline"
              onClick={() => (window.location.href = "/browse")}
            >
              <Package className="h-4 w-4 mr-2" />
              Browse Available Items
            </Button>
            <Button
              className="w-full justify-start"
              variant="outline"
              onClick={() => (window.location.href = "/bookings")}
            >
              <Calendar className="h-4 w-4 mr-2" />
              View My Bookings
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Booking Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  Success Rate
                </span>
                <span className="text-sm font-medium">
                  {stats.total > 0
                    ? Math.round((stats.returned / stats.total) * 100)
                    : 0}
                  %
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  Average Duration
                </span>
                <span className="text-sm font-medium">7 days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  Most Used Category
                </span>
                <span className="text-sm font-medium">Equipment</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
