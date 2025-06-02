//apps/api/libs/database/src/index.ts
// config
export * from "./config/database.config";

// constants
export * from "./constants/connection-name";

// schemas
export * from "./schemas/audit";
export * from "./schemas/booking";
export * from "./schemas/inventory";
export * from "./schemas/notification";
export * from "./schemas/reporting";
export * from "./schemas/users";

// schemas - merged
export * from "./schemas/merged-schemas";

// types
export * from "./types/database.types";

// module
export * from "./database.module";

//export operators
export {
  and,
  eq,
  ne,
  gte,
  lte,
  min,
  sql,
  inArray,
  asc,
  desc,
  count,
  SQL,
} from "drizzle-orm"; // Export operators
