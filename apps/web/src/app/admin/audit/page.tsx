"use client";

import { useEffect, useState } from "react";
import { getAllAuditLogs } from "@/actions/audit/server-actions";
import { useCurrentUser } from "@/hooks/use-current-user";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@shared/ui/components/ui/card";
import { Input } from "@shared/ui/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@shared/ui/components/ui/select";
import { Badge } from "@shared/ui/components/ui/badge";
import { Button } from "@shared/ui/components/ui/button";
import { FileText, Search, Download, Filter } from "lucide-react";
import { format } from "date-fns";
import type { AuditLog, ProtoTimestamp } from "@shared/types";

// Helper function to convert ProtoTimestamp to Date
const protoTimestampToDate = (timestamp?: ProtoTimestamp): Date => {
  if (!timestamp) return new Date();
  return new Date(
    (timestamp.seconds || 0) * 1000 + (timestamp.nanos || 0) / 1000000,
  );
};

export default function AuditLogsPage() {
  const { user: currentUser } = useCurrentUser();
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [actionFilter, setActionFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("all");

  useEffect(() => {
    if (currentUser?.role === "ADMIN") {
      loadAuditLogs();
    }
  }, [currentUser]);

  const loadAuditLogs = async () => {
    try {
      setLoading(true);
      const logs: AuditLog[] = (await getAllAuditLogs()).logs;
      setAuditLogs(logs);
    } catch (error) {
      console.error("Failed to load audit logs:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = auditLogs.filter((log) => {
    const matchesSearch =
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.details &&
        log.details.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesAction =
      actionFilter === "all" ||
      log.action.toLowerCase().includes(actionFilter.toLowerCase());

    let matchesDate = true;
    if (dateFilter !== "all") {
      const logDate = protoTimestampToDate(log.timestamp);
      const now = new Date();
      switch (dateFilter) {
        case "today":
          matchesDate =
            format(logDate, "yyyy-MM-dd") === format(now, "yyyy-MM-dd");
          break;
        case "week":
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          matchesDate = logDate >= weekAgo;
          break;
        case "month":
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          matchesDate = logDate >= monthAgo;
          break;
      }
    }

    return matchesSearch && matchesAction && matchesDate;
  });

  const exportLogs = () => {
    const csvContent = [
      [
        "Timestamp",
        "User ID",
        "Action",
        "Entity Type",
        "Entity ID",
        "Details",
      ].join(","),
      ...filteredLogs.map((log) =>
        [
          format(protoTimestampToDate(log.timestamp), "yyyy-MM-dd HH:mm:ss"),
          log.userId,
          log.action,
          log.entityType || "",
          log.entityId || "",
          log.details || "",
        ]
          .map((field) => `"${field}"`)
          .join(","),
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `audit-logs-${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getActionBadgeColor = (action: string) => {
    if (action.includes("create")) return "bg-green-100 text-green-800";
    if (action.includes("update")) return "bg-blue-100 text-blue-800";
    if (action.includes("delete")) return "bg-red-100 text-red-800";
    if (action.includes("login")) return "bg-purple-100 text-purple-800";
    return "bg-gray-100 text-gray-800";
  };

  if (currentUser?.role !== "ADMIN") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-96">
          <CardContent className="pt-6">
            <div className="text-center">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Access Denied</h3>
              <p className="text-muted-foreground">
                You don't have permission to access audit logs.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Audit Logs</h1>
          <p className="text-muted-foreground">
            Track all system activities and changes
          </p>
        </div>
        <Button onClick={exportLogs} disabled={filteredLogs.length === 0}>
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Logs</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{auditLogs.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Today's Activities
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                auditLogs.filter(
                  (log) =>
                    format(
                      protoTimestampToDate(log.timestamp),
                      "yyyy-MM-dd",
                    ) === format(new Date(), "yyyy-MM-dd"),
                ).length
              }
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unique Users</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(auditLogs.map((log) => log.userId)).size}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Filtered Results
            </CardTitle>
            <Filter className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredLogs.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Audit Trail</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={actionFilter} onValueChange={setActionFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actions</SelectItem>
                <SelectItem value="create">Create</SelectItem>
                <SelectItem value="update">Update</SelectItem>
                <SelectItem value="delete">Delete</SelectItem>
                <SelectItem value="login">Login</SelectItem>
              </SelectContent>
            </Select>
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">Last Week</SelectItem>
                <SelectItem value="month">Last Month</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredLogs.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No audit logs found matching your criteria.
                </div>
              ) : (
                filteredLogs.map((log, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge className={getActionBadgeColor(log.action)}>
                          {log.action.toUpperCase()}
                        </Badge>
                        <span className="font-medium">User: {log.userId}</span>
                        <span className="text-sm text-muted-foreground">
                          {format(
                            protoTimestampToDate(log.timestamp),
                            "MMM dd, yyyy HH:mm:ss",
                          )}
                        </span>
                      </div>
                      {log.entityType && (
                        <div className="text-sm text-muted-foreground mb-1">
                          Resource: {log.entityType}{" "}
                          {log.entityId && `(${log.entityId})`}
                        </div>
                      )}
                      {log.details && (
                        <div className="text-sm text-muted-foreground">
                          Details: {log.details}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
