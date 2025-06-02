"use client";

import { useState, useEffect } from "react";
import { getMyBookings } from "@/actions/booking/server-actions";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@shared/ui/components/ui/card";
import { Button } from "@shared/ui/components/ui/button";
import { Badge } from "@shared/ui/components/ui/badge";
import { ChevronLeft, ChevronRight, CalendarIcon } from "lucide-react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
} from "date-fns";
import type { Booking, BookingResponse } from "@shared/types";

// Helper function to convert ProtoTimestamp to Date
const protoTimestampToDate = (protoTimestamp: any): Date | undefined => {
  if (!protoTimestamp) return undefined;

  // If it's already a Date object, return it
  if (protoTimestamp instanceof Date) return protoTimestamp;

  // If it has seconds property (ProtoTimestamp format)
  if (typeof protoTimestamp === "object" && "seconds" in protoTimestamp) {
    return new Date(protoTimestamp.seconds * 1000);
  }

  // If it's a string, try to parse it
  if (typeof protoTimestamp === "string") {
    return new Date(protoTimestamp);
  }

  return undefined;
};

// Helper function to convert BookingResponse to Booking
const convertBookingResponseToBooking = (
  bookingResponse: BookingResponse,
): Booking => {
  return {
    id: bookingResponse.id,
    itemId: bookingResponse.itemId,
    userId: bookingResponse.userId,
    startTime: protoTimestampToDate(bookingResponse.startTime),
    endTime: protoTimestampToDate(bookingResponse.endTime),
    note: bookingResponse.note,
    status: bookingResponse.status,
    createdAt: protoTimestampToDate(bookingResponse.createdAt),
    updatedAt: protoTimestampToDate(bookingResponse.updatedAt),
  };
};

export default function BookingCalendarPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const response = await getMyBookings();
      // Convert BookingResponse[] to Booking[]
      const convertedBookings = (response.bookings || []).map(
        convertBookingResponseToBooking,
      );
      setBookings(convertedBookings);
    } catch (error) {
      console.error("Failed to load bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getBookingsForDay = (day: Date) => {
    return bookings.filter((booking) => {
      const startDate = booking.startTime;
      const endDate = booking.endTime;

      if (!startDate || !endDate) return false;

      // Create date objects for comparison (ignoring time)
      const dayStart = new Date(
        day.getFullYear(),
        day.getMonth(),
        day.getDate(),
      );
      const bookingStart = new Date(
        startDate.getFullYear(),
        startDate.getMonth(),
        startDate.getDate(),
      );
      const bookingEnd = new Date(
        endDate.getFullYear(),
        endDate.getMonth(),
        endDate.getDate(),
      );

      return dayStart >= bookingStart && dayStart <= bookingEnd;
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "returned":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) =>
      direction === "prev" ? subMonths(prev, 1) : addMonths(prev, 1),
    );
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Booking Calendar</h1>
          <p className="text-muted-foreground">
            View your bookings in calendar format
          </p>
        </div>
        <Button variant="outline" onClick={() => window.history.back()}>
          Back to Bookings
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              {format(currentDate, "MMMM yyyy")}
            </CardTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateMonth("prev")}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentDate(new Date())}
              >
                Today
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateMonth("next")}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1 mb-4">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div
                key={day}
                className="p-2 text-center font-medium text-muted-foreground"
              >
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day) => {
              const dayBookings = getBookingsForDay(day);
              const isToday = isSameDay(day, new Date());
              const isCurrentMonth = isSameMonth(day, currentDate);

              return (
                <div
                  key={day.toISOString()}
                  className={`min-h-24 p-2 border rounded-lg ${
                    isCurrentMonth ? "bg-background" : "bg-muted/50"
                  } ${isToday ? "ring-2 ring-primary" : ""}`}
                >
                  <div
                    className={`text-sm font-medium mb-1 ${isCurrentMonth ? "" : "text-muted-foreground"}`}
                  >
                    {format(day, "d")}
                  </div>
                  <div className="space-y-1">
                    {dayBookings.slice(0, 2).map((booking) => (
                      <div
                        key={booking.id}
                        className={`text-xs p-1 rounded truncate ${getStatusColor(booking.status)}`}
                        title={`Item: ${booking.itemId} - ${booking.status}`}
                      >
                        {booking.itemId}
                      </div>
                    ))}
                    {dayBookings.length > 2 && (
                      <div className="text-xs text-muted-foreground">
                        +{dayBookings.length - 2} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Legend */}
      <Card>
        <CardHeader>
          <CardTitle>Status Legend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
              <span className="text-sm">Awaiting approval</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-green-100 text-green-800">Approved</Badge>
              <span className="text-sm">Booking confirmed</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-red-100 text-red-800">Rejected</Badge>
              <span className="text-sm">Booking denied</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-blue-100 text-blue-800">Returned</Badge>
              <span className="text-sm">Item returned</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
