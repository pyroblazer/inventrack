import * as auditSchema from "./audit";
import * as bookingSchema from "./booking";
import * as inventorySchema from "./inventory";
import * as notificationSchema from "./notification";
import * as reportingSchema from "./reporting";
import * as userSchema from "./users";

export const mergedSchemas = {
  ...auditSchema,
  ...bookingSchema,
  ...inventorySchema,
  ...notificationSchema,
  ...reportingSchema,
  ...userSchema,
};
