export const GRPC_PACKAGE_NAME = "api";

export const GRPC_DEFAULT_OPTIONS = {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
  maxReceiveMessageLength: 1024 * 1024 * 10, // 10MB
  maxSendMessageLength: 1024 * 1024 * 10,
};

export const GRPC_SERVICES = {
  AUTH: "AuthService",
  COMPONENTS: "ComponentsService",
  USERS: "UsersService",
  BOOKING: "BookingService",
  INVENTORY: "InventoryService",
} as const;
