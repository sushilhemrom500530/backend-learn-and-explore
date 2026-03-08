import express from "express";
import { UserController } from "./user.controller";
import { auth } from "./../../middlewares/auth";
import validateRequest from "./../../shared/validateRequest";
import { multiUploadHandler } from "./../../middlewares/fileUploadHandler";
import { userValidation } from "./user.validation";

const router = express.Router();

router.get("/all", auth("admin"), UserController.getAll);

router.get(
  "/find/:id",
  auth("admin", "parent", "teen"),
  UserController.getSingleUser,
);

router.patch(
  "/update-my-profile",
  auth("admin", "parent", "teen"),
  multiUploadHandler([{ name: "profile", maxCount: 1 }]),
  UserController.updateMyProfile,
);

router.get(
  "/get-my-profile",
  auth("admin", "parent", "teen"),
  UserController.getMyProfile,
);

router.patch(
  "/delete/my-account",
  auth("admin", "parent", "teen"),
  UserController.softDeleteUser,
);

router.delete("/delete/:id", auth("admin"), UserController.deleteUser);

router.patch(
  "/change-status/:id",
  auth("admin"),
  validateRequest(userValidation.changeUserStatus),
  UserController.changeUserStatus,
);

export const UserRoutes = router;
