import { z } from "zod";

const createReportValidation = z.object({
  issueType: z.enum(
    [
      "spam",
      "fraud",
      "abuse",
      "inappropriate",
      "warning",
      "misinformation",
      "technical",
      "privacy",
      "harassment",
      "other",
    ],
    {
      required_error: "Status is required",
      invalid_type_error:
        "Invalid status value, you can use 'spam', 'fraud', 'abuse', 'inappropriate', 'warning', 'misinformation', 'technical', 'privacy', 'harassment', or 'other'",
    }
  ),
  description: z.string().min(1, "Description is required"),
});

const commonSettingsSchema = z.object({
  title: z
    .string()
    .min(5, "Title must be at least 5 characters long")
    .optional(),
  description: z
    .string()
    .min(5, "Description must be at least 5 characters long")
    .optional(),
  content: z.string().min(5, "Content must be at least 5 characters long"),
});

export const CommonValidation = {
  createReportValidation,
  commonSettingsSchema,
};
