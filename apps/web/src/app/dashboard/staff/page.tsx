// app/dashboard/staff/page.tsx
"use client";

import { useEffect, useState } from "react";
import { getMyBookings } from "@/actions/booking/server-actions";
import { getStaffDashboard } from "@/actions/reporting/server-actions";
import { useCurrentUser } from "@/hooks/use-current-user";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@shared/ui/components/ui/card";
import { Calendar, Package, Clock, CheckCircle } from "lucide-react";
import { format } from "date-fns";
import type { Booking, ProtoTimestamp } from "@shared/types";

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

export default function StaffDashboard() {
  const { user, isLoading: userLoading } = useCurrentUser();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [dashboardData, setDashboardData] = useState<StaffDashboardData | null>(
    null,
  );
  const [loading, setLoading] = useState(true);

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
      const [myBookingsResponse] = await Promise.all([
        getMyBookings(),
        // getStaffDashboard({
        //   userId: user.id,
        // }),
      ]);

      console.log(
        "dashboard staff page myBookingsResponse",
        myBookingsResponse,
      );
      // console.log("dashboard staff page staffData", staffData)

      // Extract bookings array from the response and convert ProtoTimestamp to Date for time fields.
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
      // setDashboardData(staffData);
    } catch (error) {
      console.error("Failed to load staff dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const getBookingStats = (): BookingStats => {
    const pending = bookings.filter((b) => b.status === "pending").length;
    const approved = bookings.filter((b) => b.status === "approved").length;
    const returned = bookings.filter((b) => b.status === "returned").length;
    const overdue = bookings.filter(
      (b) => b.status === "approved" && b.endTime && b.endTime < new Date(),
    ).length;

    return { pending, approved, returned, overdue, total: bookings.length };
  };

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
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">My Dashboard</h1>
        <div className="text-sm text-muted-foreground">
          Welcome back, {user?.username || user?.email}
        </div>
      </div>

      {/* Stats Cards */}
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
          </CardContent>
        </Card>
      </div>

      {/* Recent Bookings */}
      <Card>
        <CardHeader>
          <CardTitle>My Recent Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {bookings.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                No bookings yet. Start by browsing available items!
              </div>
            ) : (
              bookings.slice(0, 10).map((booking) => (
                <div
                  key={booking.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex-1">
                    <div className="font-medium">Item ID: {booking.itemId}</div>
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
                        {booking.note}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-4">
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
    </div>
  );
}
