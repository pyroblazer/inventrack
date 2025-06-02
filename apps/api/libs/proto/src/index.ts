// Re-export with namespaces to avoid conflicts
export type { Timestamp } from "./generated/google/protobuf/timestamp";
export * as AuditProto from "./generated/audit";
export * as AuthProto from "./generated/auth";
export * as BookingProto from "./generated/booking";
export * as InventoryProto from "./generated/inventory";
export * as NotificationProto from "./generated/notification";
export * as ReportingProto from "./generated/reporting";
export * as UsersProto from "./generated/users";

// Export other utilities
export * from "./constants/grpc.constants";
export * from "./interfaces/grpc-options.interface";
export * from "./interfaces/service-definitions.interface";
export * from "./utils/type-converter.util";
export * from "./interceptors/grpc-validation.interceptor";
export * from "./decorators/grpc-method.decorator";
