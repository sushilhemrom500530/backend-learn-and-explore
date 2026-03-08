import mongoose, { model, Schema } from "mongoose";
import { IUser, IOTP } from "./user.interface";
import bcrypt from "bcrypt";

const userSchema = new Schema<IUser>(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      select: false,
    },
    role: {
      type: String,
      enum: ["admin", "parent", "teen"],
    },
    dateOfBirth: {
      type: String,
      required: true,
    },
    profilePhoto: {
      type: String,
      default:
        "https://iter-bene.s3.eu-north-1.amazonaws.com/15206766-215b-415e-8016-dd1bd32c4ad6.png",
    },
    provider: {
      type: String,
      enum: ["google", "apple"],
    },
    providerId: {
      type: String,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["pending", "active", "inactive", "suspended", "deleted"],
      default: "active",
    },
  },
  { timestamps: true },
);

// OTP Schema
const OTPSchema = new Schema<IOTP>({
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  otp: {
    type: String,
    required: true,
    trim: true,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
});

// Pre-save hook for hashing password
userSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err as any);
  }
});

// user model
export const User = model<IUser>("User", userSchema);

// OTP model
export const OTP = mongoose.model<IOTP>("Otp", OTPSchema);
