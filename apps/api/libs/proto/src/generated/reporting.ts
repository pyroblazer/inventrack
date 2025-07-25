// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.7.2
//   protoc               v5.29.3
// source: reporting.proto

/* eslint-disable */
import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";
import { messageTypeRegistry } from "./typeRegistry";

export const protobufPackage = "api.reporting";

/** apps/api/libs/proto/src/proto/reporting.proto */

export interface DashboardRequest {
  $type: "api.reporting.DashboardRequest";
  startDate: string;
  endDate: string;
}

export interface AdminDashboardResponse {
  $type: "api.reporting.AdminDashboardResponse";
  items: TopItem[];
  categoryStats: CategoryBookings[];
  usageTrends: UsageTrend[];
  overdueReturns: OverdueReturn[];
}

export interface TopItem {
  $type: "api.reporting.TopItem";
  itemId: string;
  name: string;
  bookingCount: number;
}

export interface CategoryBookings {
  $type: "api.reporting.CategoryBookings";
  category: string;
  totalBookings: number;
}

export interface UsageTrend {
  $type: "api.reporting.UsageTrend";
  date: string;
  count: number;
}

export interface OverdueReturn {
  $type: "api.reporting.OverdueReturn";
  bookingId: string;
  itemId: string;
  dueDate: string;
  userId: string;
}

export interface StaffDashboardRequest {
  $type: "api.reporting.StaffDashboardRequest";
  userId: string;
}

export interface StaffDashboardResponse {
  $type: "api.reporting.StaffDashboardResponse";
  history: BookingHistory[];
}

export interface BookingHistory {
  $type: "api.reporting.BookingHistory";
  bookingId: string;
  itemId: string;
  status: string;
  startDate: string;
  endDate: string;
}

export interface ExportRequest {
  $type: "api.reporting.ExportRequest";
  /** csv, pdf */
  format: string;
  rangeStart: string;
  rangeEnd: string;
}

export interface ExportResponse {
  $type: "api.reporting.ExportResponse";
  downloadUrl: string;
}

export const API_REPORTING_PACKAGE_NAME = "api.reporting";

function createBaseDashboardRequest(): DashboardRequest {
  return {
    $type: "api.reporting.DashboardRequest",
    startDate: "",
    endDate: "",
  };
}

export const DashboardRequest: MessageFns<
  DashboardRequest,
  "api.reporting.DashboardRequest"
> = {
  $type: "api.reporting.DashboardRequest" as const,

  encode(
    message: DashboardRequest,
    writer: BinaryWriter = new BinaryWriter(),
  ): BinaryWriter {
    if (message.startDate !== "") {
      writer.uint32(10).string(message.startDate);
    }
    if (message.endDate !== "") {
      writer.uint32(18).string(message.endDate);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): DashboardRequest {
    const reader =
      input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseDashboardRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
            break;
          }

          message.startDate = reader.string();
          continue;
        }
        case 2: {
          if (tag !== 18) {
            break;
          }

          message.endDate = reader.string();
          continue;
        }
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },
};

messageTypeRegistry.set(DashboardRequest.$type, DashboardRequest);

function createBaseAdminDashboardResponse(): AdminDashboardResponse {
  return {
    $type: "api.reporting.AdminDashboardResponse",
    items: [],
    categoryStats: [],
    usageTrends: [],
    overdueReturns: [],
  };
}

export const AdminDashboardResponse: MessageFns<
  AdminDashboardResponse,
  "api.reporting.AdminDashboardResponse"
> = {
  $type: "api.reporting.AdminDashboardResponse" as const,

  encode(
    message: AdminDashboardResponse,
    writer: BinaryWriter = new BinaryWriter(),
  ): BinaryWriter {
    for (const v of message.items) {
      TopItem.encode(v!, writer.uint32(10).fork()).join();
    }
    for (const v of message.categoryStats) {
      CategoryBookings.encode(v!, writer.uint32(18).fork()).join();
    }
    for (const v of message.usageTrends) {
      UsageTrend.encode(v!, writer.uint32(26).fork()).join();
    }
    for (const v of message.overdueReturns) {
      OverdueReturn.encode(v!, writer.uint32(34).fork()).join();
    }
    return writer;
  },

  decode(
    input: BinaryReader | Uint8Array,
    length?: number,
  ): AdminDashboardResponse {
    const reader =
      input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseAdminDashboardResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
            break;
          }

          message.items.push(TopItem.decode(reader, reader.uint32()));
          continue;
        }
        case 2: {
          if (tag !== 18) {
            break;
          }

          message.categoryStats.push(
            CategoryBookings.decode(reader, reader.uint32()),
          );
          continue;
        }
        case 3: {
          if (tag !== 26) {
            break;
          }

          message.usageTrends.push(UsageTrend.decode(reader, reader.uint32()));
          continue;
        }
        case 4: {
          if (tag !== 34) {
            break;
          }

          message.overdueReturns.push(
            OverdueReturn.decode(reader, reader.uint32()),
          );
          continue;
        }
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },
};

messageTypeRegistry.set(AdminDashboardResponse.$type, AdminDashboardResponse);

function createBaseTopItem(): TopItem {
  return {
    $type: "api.reporting.TopItem",
    itemId: "",
    name: "",
    bookingCount: 0,
  };
}

export const TopItem: MessageFns<TopItem, "api.reporting.TopItem"> = {
  $type: "api.reporting.TopItem" as const,

  encode(
    message: TopItem,
    writer: BinaryWriter = new BinaryWriter(),
  ): BinaryWriter {
    if (message.itemId !== "") {
      writer.uint32(10).string(message.itemId);
    }
    if (message.name !== "") {
      writer.uint32(18).string(message.name);
    }
    if (message.bookingCount !== 0) {
      writer.uint32(24).int32(message.bookingCount);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): TopItem {
    const reader =
      input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTopItem();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
            break;
          }

          message.itemId = reader.string();
          continue;
        }
        case 2: {
          if (tag !== 18) {
            break;
          }

          message.name = reader.string();
          continue;
        }
        case 3: {
          if (tag !== 24) {
            break;
          }

          message.bookingCount = reader.int32();
          continue;
        }
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },
};

messageTypeRegistry.set(TopItem.$type, TopItem);

function createBaseCategoryBookings(): CategoryBookings {
  return {
    $type: "api.reporting.CategoryBookings",
    category: "",
    totalBookings: 0,
  };
}

export const CategoryBookings: MessageFns<
  CategoryBookings,
  "api.reporting.CategoryBookings"
> = {
  $type: "api.reporting.CategoryBookings" as const,

  encode(
    message: CategoryBookings,
    writer: BinaryWriter = new BinaryWriter(),
  ): BinaryWriter {
    if (message.category !== "") {
      writer.uint32(10).string(message.category);
    }
    if (message.totalBookings !== 0) {
      writer.uint32(16).int32(message.totalBookings);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): CategoryBookings {
    const reader =
      input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCategoryBookings();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
            break;
          }

          message.category = reader.string();
          continue;
        }
        case 2: {
          if (tag !== 16) {
            break;
          }

          message.totalBookings = reader.int32();
          continue;
        }
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },
};

messageTypeRegistry.set(CategoryBookings.$type, CategoryBookings);

function createBaseUsageTrend(): UsageTrend {
  return { $type: "api.reporting.UsageTrend", date: "", count: 0 };
}

export const UsageTrend: MessageFns<UsageTrend, "api.reporting.UsageTrend"> = {
  $type: "api.reporting.UsageTrend" as const,

  encode(
    message: UsageTrend,
    writer: BinaryWriter = new BinaryWriter(),
  ): BinaryWriter {
    if (message.date !== "") {
      writer.uint32(10).string(message.date);
    }
    if (message.count !== 0) {
      writer.uint32(16).int32(message.count);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): UsageTrend {
    const reader =
      input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseUsageTrend();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
            break;
          }

          message.date = reader.string();
          continue;
        }
        case 2: {
          if (tag !== 16) {
            break;
          }

          message.count = reader.int32();
          continue;
        }
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },
};

messageTypeRegistry.set(UsageTrend.$type, UsageTrend);

function createBaseOverdueReturn(): OverdueReturn {
  return {
    $type: "api.reporting.OverdueReturn",
    bookingId: "",
    itemId: "",
    dueDate: "",
    userId: "",
  };
}

export const OverdueReturn: MessageFns<
  OverdueReturn,
  "api.reporting.OverdueReturn"
> = {
  $type: "api.reporting.OverdueReturn" as const,

  encode(
    message: OverdueReturn,
    writer: BinaryWriter = new BinaryWriter(),
  ): BinaryWriter {
    if (message.bookingId !== "") {
      writer.uint32(10).string(message.bookingId);
    }
    if (message.itemId !== "") {
      writer.uint32(18).string(message.itemId);
    }
    if (message.dueDate !== "") {
      writer.uint32(26).string(message.dueDate);
    }
    if (message.userId !== "") {
      writer.uint32(34).string(message.userId);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): OverdueReturn {
    const reader =
      input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseOverdueReturn();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
            break;
          }

          message.bookingId = reader.string();
          continue;
        }
        case 2: {
          if (tag !== 18) {
            break;
          }

          message.itemId = reader.string();
          continue;
        }
        case 3: {
          if (tag !== 26) {
            break;
          }

          message.dueDate = reader.string();
          continue;
        }
        case 4: {
          if (tag !== 34) {
            break;
          }

          message.userId = reader.string();
          continue;
        }
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },
};

messageTypeRegistry.set(OverdueReturn.$type, OverdueReturn);

function createBaseStaffDashboardRequest(): StaffDashboardRequest {
  return { $type: "api.reporting.StaffDashboardRequest", userId: "" };
}

export const StaffDashboardRequest: MessageFns<
  StaffDashboardRequest,
  "api.reporting.StaffDashboardRequest"
> = {
  $type: "api.reporting.StaffDashboardRequest" as const,

  encode(
    message: StaffDashboardRequest,
    writer: BinaryWriter = new BinaryWriter(),
  ): BinaryWriter {
    if (message.userId !== "") {
      writer.uint32(10).string(message.userId);
    }
    return writer;
  },

  decode(
    input: BinaryReader | Uint8Array,
    length?: number,
  ): StaffDashboardRequest {
    const reader =
      input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseStaffDashboardRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
            break;
          }

          message.userId = reader.string();
          continue;
        }
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },
};

messageTypeRegistry.set(StaffDashboardRequest.$type, StaffDashboardRequest);

function createBaseStaffDashboardResponse(): StaffDashboardResponse {
  return { $type: "api.reporting.StaffDashboardResponse", history: [] };
}

export const StaffDashboardResponse: MessageFns<
  StaffDashboardResponse,
  "api.reporting.StaffDashboardResponse"
> = {
  $type: "api.reporting.StaffDashboardResponse" as const,

  encode(
    message: StaffDashboardResponse,
    writer: BinaryWriter = new BinaryWriter(),
  ): BinaryWriter {
    for (const v of message.history) {
      BookingHistory.encode(v!, writer.uint32(10).fork()).join();
    }
    return writer;
  },

  decode(
    input: BinaryReader | Uint8Array,
    length?: number,
  ): StaffDashboardResponse {
    const reader =
      input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseStaffDashboardResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
            break;
          }

          message.history.push(BookingHistory.decode(reader, reader.uint32()));
          continue;
        }
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },
};

messageTypeRegistry.set(StaffDashboardResponse.$type, StaffDashboardResponse);

function createBaseBookingHistory(): BookingHistory {
  return {
    $type: "api.reporting.BookingHistory",
    bookingId: "",
    itemId: "",
    status: "",
    startDate: "",
    endDate: "",
  };
}

export const BookingHistory: MessageFns<
  BookingHistory,
  "api.reporting.BookingHistory"
> = {
  $type: "api.reporting.BookingHistory" as const,

  encode(
    message: BookingHistory,
    writer: BinaryWriter = new BinaryWriter(),
  ): BinaryWriter {
    if (message.bookingId !== "") {
      writer.uint32(10).string(message.bookingId);
    }
    if (message.itemId !== "") {
      writer.uint32(18).string(message.itemId);
    }
    if (message.status !== "") {
      writer.uint32(26).string(message.status);
    }
    if (message.startDate !== "") {
      writer.uint32(34).string(message.startDate);
    }
    if (message.endDate !== "") {
      writer.uint32(42).string(message.endDate);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): BookingHistory {
    const reader =
      input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseBookingHistory();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
            break;
          }

          message.bookingId = reader.string();
          continue;
        }
        case 2: {
          if (tag !== 18) {
            break;
          }

          message.itemId = reader.string();
          continue;
        }
        case 3: {
          if (tag !== 26) {
            break;
          }

          message.status = reader.string();
          continue;
        }
        case 4: {
          if (tag !== 34) {
            break;
          }

          message.startDate = reader.string();
          continue;
        }
        case 5: {
          if (tag !== 42) {
            break;
          }

          message.endDate = reader.string();
          continue;
        }
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },
};

messageTypeRegistry.set(BookingHistory.$type, BookingHistory);

function createBaseExportRequest(): ExportRequest {
  return {
    $type: "api.reporting.ExportRequest",
    format: "",
    rangeStart: "",
    rangeEnd: "",
  };
}

export const ExportRequest: MessageFns<
  ExportRequest,
  "api.reporting.ExportRequest"
> = {
  $type: "api.reporting.ExportRequest" as const,

  encode(
    message: ExportRequest,
    writer: BinaryWriter = new BinaryWriter(),
  ): BinaryWriter {
    if (message.format !== "") {
      writer.uint32(10).string(message.format);
    }
    if (message.rangeStart !== "") {
      writer.uint32(18).string(message.rangeStart);
    }
    if (message.rangeEnd !== "") {
      writer.uint32(26).string(message.rangeEnd);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): ExportRequest {
    const reader =
      input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseExportRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
            break;
          }

          message.format = reader.string();
          continue;
        }
        case 2: {
          if (tag !== 18) {
            break;
          }

          message.rangeStart = reader.string();
          continue;
        }
        case 3: {
          if (tag !== 26) {
            break;
          }

          message.rangeEnd = reader.string();
          continue;
        }
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },
};

messageTypeRegistry.set(ExportRequest.$type, ExportRequest);

function createBaseExportResponse(): ExportResponse {
  return { $type: "api.reporting.ExportResponse", downloadUrl: "" };
}

export const ExportResponse: MessageFns<
  ExportResponse,
  "api.reporting.ExportResponse"
> = {
  $type: "api.reporting.ExportResponse" as const,

  encode(
    message: ExportResponse,
    writer: BinaryWriter = new BinaryWriter(),
  ): BinaryWriter {
    if (message.downloadUrl !== "") {
      writer.uint32(10).string(message.downloadUrl);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): ExportResponse {
    const reader =
      input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseExportResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
            break;
          }

          message.downloadUrl = reader.string();
          continue;
        }
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },
};

messageTypeRegistry.set(ExportResponse.$type, ExportResponse);

export interface ReportingServiceClient {
  getAdminDashboardData(
    request: DashboardRequest,
  ): Observable<AdminDashboardResponse>;

  getStaffDashboardData(
    request: StaffDashboardRequest,
  ): Observable<StaffDashboardResponse>;

  exportUsageLogs(request: ExportRequest): Observable<ExportResponse>;
}

export interface ReportingServiceController {
  getAdminDashboardData(
    request: DashboardRequest,
  ):
    | Promise<AdminDashboardResponse>
    | Observable<AdminDashboardResponse>
    | AdminDashboardResponse;

  getStaffDashboardData(
    request: StaffDashboardRequest,
  ):
    | Promise<StaffDashboardResponse>
    | Observable<StaffDashboardResponse>
    | StaffDashboardResponse;

  exportUsageLogs(
    request: ExportRequest,
  ): Promise<ExportResponse> | Observable<ExportResponse> | ExportResponse;
}

export function ReportingServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = [
      "getAdminDashboardData",
      "getStaffDashboardData",
      "exportUsageLogs",
    ];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(
        constructor.prototype,
        method,
      );
      GrpcMethod("ReportingService", method)(
        constructor.prototype[method],
        method,
        descriptor,
      );
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(
        constructor.prototype,
        method,
      );
      GrpcStreamMethod("ReportingService", method)(
        constructor.prototype[method],
        method,
        descriptor,
      );
    }
  };
}

export const REPORTING_SERVICE_NAME = "ReportingService";

export interface MessageFns<T, V extends string> {
  readonly $type: V;
  encode(message: T, writer?: BinaryWriter): BinaryWriter;
  decode(input: BinaryReader | Uint8Array, length?: number): T;
}
