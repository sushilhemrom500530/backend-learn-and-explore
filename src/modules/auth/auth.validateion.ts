import { z } from "zod";

export const registerSchema = z
  .object({
    fullName: z.string({
      required_error: "Name is required",
    }),

    email: z
      .string({
        required_error: "Email is required",
      })
      .email("Invalid email"),

    password: z
      .string({
        required_error: "Password is required",
      })
      .min(6, "Password must be at least 6 characters"),

    confirmPassword: z
      .string({
        required_error: "Confirm password is required",
      })
      .min(6, "Confirm password must be at least 6 characters"),

    role: z.enum(["admin", "parent", "teen"], {
      required_error: "Role is required",
      invalid_type_error: "Invalid role",
    }),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        path: ["confirmPassword"],
        message: "Passwords do not match",
        code: z.ZodIssueCode.custom,
      });
    }
  });

const loginUserSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z
    .string({
      required_error: "Password is required",
    })
    .min(6, "Confirm password must be at least 6 characters"),
});

const otpSchema = z.object({
  otp: z.string({
    required_error: "Otp is required",
  }),
});

const forgotPasswordSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email("Invalid email"),
});

const resetPasswordSchema = z.object({
  newPassword: z
    .string({
      required_error: "Password is required",
    })
    .min(6, "Confirm password must be at least 6 characters"),
  confirmPassword: z
    .string({
      required_error: "Confirm password is required",
    })
    .min(6, "Confirm password must be at least 6 characters"),
});

const changePasswordSchema = z.object({
  oldPassword: z
    .string({
      required_error: "Old password is required",
    })
    .min(6, "Confirm password must be at least 6 characters"),
  newPassword: z
    .string({
      required_error: "New password is required",
    })
    .min(6, "New password must be at least 6 characters"),
  confirmPassword: z
    .string({
      required_error: "Confirm password is required",
    })
    .min(6, "Confirm password must be at least 6 characters"),
});

const googleLoginSchema = z.object({
  idToken: z.string({
    required_error: "Google ID token is required",
  }),
  role: z.enum(["customer", "provider"], {
    required_error: "Role is required for new users",
  }),
});

const appleLoginSchema = z.object({
  identityToken: z.string({
    required_error: "Apple identity token is required",
  }),
  role: z.enum(["customer", "provider"], {
    required_error: "Role is required for new users",
  }),
  user: z
    .object({
      name: z
        .object({
          firstName: z.string().optional(),
          lastName: z.string().optional(),
        })
        .optional(),
      email: z.string().email().optional(),
    })
    .optional(),
});

export const authValidation = {
  registerSchema,
  loginUserSchema,
  otpSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
  googleLoginSchema,
  appleLoginSchema,
};
