// app/dashboard/admin/page.tsx
"use client";

import { useEffect, useState } from "react";
import { getAdminDashboard } from "@/actions/reporting/server-actions";
import { getAllAuditLogs } from "@/actions/audit/server-actions";
import { getAllBookings } from "@/actions/booking/server-actions";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@shared/ui/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { Calendar, Package, Users, AlertTriangle } from "lucide-react";
import { format, subDays } from "date-fns";
import type { AuditLog, Booking, ProtoTimestamp } from "@shared/types";

// Type definitions
interface DashboardData {
  items: {
    itemId: string;
    name: string;
    bookingCount: number;
  }[];
  categoryStats: {
    category: string;
    totalBookings: number;
  }[];
  usageTrends: {
    date: string;
    count: number;
  }[];
  overdueReturns: {
    bookingId: string;
    itemId: string;
    dueDate: string;
    userId: string;
  }[];
}

interface BookingStats {
  pending: number;
  approved: number;
  overdue: number;
  total: number;
}

interface UsageTrend {
  date: string;
  bookings: number;
}

interface MostBookedItem {
  itemId: string;
  count: number;
}

// Helper function to convert ProtoTimestamp to Date
const protoTimestampToDate = (timestamp?: ProtoTimestamp): Date => {
  if (!timestamp) return new Date();
  // Assuming ProtoTimestamp has seconds and nanos properties
  return new Date(
    (timestamp.seconds || 0) * 1000 + (timestamp.nanos || 0) / 1000000,
  );
};

// Helper function to convert ProtoTimestamp to string
const protoTimestampToString = (timestamp?: ProtoTimestamp): string => {
  return protoTimestampToDate(timestamp).toISOString();
};

export default function AdminDashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null,
  );
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    startDate: format(subDays(new Date(), 30), "yyyy-MM-dd"),
    endDate: format(new Date(), "yyyy-MM-dd"),
  });

  useEffect(() => {
    loadDashboardData();
  }, [dateRange]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [dashboard, logs, allBookings] = await Promise.all([
        getAdminDashboard({
          startDate: dateRange.startDate,
          endDate: dateRange.endDate,
        }),
        getAllAuditLogs(),
        getAllBookings(),
      ]);

      setDashboardData(dashboard);
      setAuditLogs(logs.logs);
      setBookings(allBookings);
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getBookingStats = (): BookingStats => {
    const pending = bookings.filter((b) => b.status === "pending").length;
    const approved = bookings.filter((b) => b.status === "approved").length;
    const overdue = bookings.filter(
      (b) => b.status === "approved" && b.endTime && b.endTime < new Date(),
    ).length;

    return { pending, approved, overdue, total: bookings.length };
  };

  const getMostBookedItems = (): MostBookedItem[] => {
    const itemCounts: Record<string, number> = {};
    bookings.forEach((booking) => {
      if (booking.itemId) {
        itemCounts[booking.itemId] = (itemCounts[booking.itemId] || 0) + 1;
      }
    });

    return Object.entries(itemCounts)
      .map(([itemId, count]) => ({ itemId, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  };

  const getUsageTrends = (): UsageTrend[] => {
    const last7Days: UsageTrend[] = [];
    for (let i = 6; i >= 0; i--) {
      const date = subDays(new Date(), i);
      const dayBookings = bookings.filter((b) => {
        const bookingDate = b.createdAt ? b.createdAt : new Date();
        return format(bookingDate, "yyyy-MM-dd") === format(date, "yyyy-MM-dd");
      }).length;

      last7Days.push({
        date: format(date, "MMM dd"),
        bookings: dayBookings,
      });
    }
    return last7Days;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const stats = getBookingStats();
  const mostBookedItems = getMostBookedItems();
  const usageTrends = getUsageTrends();

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <div className="flex gap-4">
          <input
            type="date"
            value={dateRange.startDate}
            onChange={(e) =>
              setDateRange((prev) => ({ ...prev, startDate: e.target.value }))
            }
            className="px-3 py-2 border rounded-md"
          />
          <input
            type="date"
            value={dateRange.endDate}
            onChange={(e) =>
              setDateRange((prev) => ({ ...prev, endDate: e.target.value }))
            }
            className="px-3 py-2 border rounded-md"
          />
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
            <CardTitle className="text-sm font-medium">
              Pending Approvals
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {stats.pending}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Bookings
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.approved}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Overdue Returns
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {stats.overdue}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Usage Trends (Last 7 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={usageTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="bookings"
                  stroke="#8884d8"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Most Booked Items</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={mostBookedItems}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="itemId" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {auditLogs.slice(0, 10).map((log, index) => (
              <div key={index} className="flex items-center space-x-4 text-sm">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <span className="font-medium">{log.action}</span>
                  <span className="text-muted-foreground">
                    {" "}
                    by {log.userId}
                  </span>
                </div>
                <div className="text-muted-foreground">
                  {format(protoTimestampToDate(log.timestamp), "MMM dd, HH:mm")}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
