import { z } from "zod";

const changeUserStatus = z.object({
  status: z.enum(["active", "inactive", "blocked", "suspended"], {
    required_error: "Status is required",
    invalid_type_error:
      "Invalid status value, you can use 'active', 'inactive' , 'blocked' or 'suspended'",
  }),
});

export const userValidation = {
  changeUserStatus,
};
