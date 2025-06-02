//packages/types/src/api-client/reporting-endpoints.ts

export type ReportingEndpoints = {
  getAdminDashboard: {
    body: {
      startDate: string;
      endDate: string;
    };
    response: {
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
    };
  };

  getStaffDashboard: {
    body: {
      userId: string;
    };
    response: {
      history: {
        bookingId: string;
        itemId: string;
        status: string;
        startDate: string;
        endDate: string;
      }[];
    };
  };

  exportUsageLogs: {
    body: {
      format: "csv" | "pdf";
      rangeStart: string;
      rangeEnd: string;
    };
    response: {
      downloadUrl: string;
    };
  };
};
