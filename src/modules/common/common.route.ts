import express from "express";
import { CommonController } from "./common.controller";
import { auth } from "./../../middlewares/auth";
import validateRequest from "./../../shared/validateRequest";
import { CommonValidation } from "./common.validation";

const router = express.Router();

// for admin setting common settings like about, terms, privacy part
// about us
router.post(
  "/about/create",
  validateRequest(CommonValidation.commonSettingsSchema),
  auth("admin"),
  CommonController.createAbout,
);

router.get("/about", CommonController.getAllAbout);

router.patch("/about/update/:id", auth("admin"), CommonController.updateAbout);

// terms and conditions
router.post(
  "/terms/create",
  validateRequest(CommonValidation.commonSettingsSchema),
  auth("admin"),
  CommonController.createTermsInDB,
);

router.get("/terms", CommonController.getAllTermsFromDB);

router.patch(
  "/terms/update/:id",
  auth("admin"),
  CommonController.updateTermsInDB,
);

// privacy policy
router.post(
  "/privacy-policy/create",
  validateRequest(CommonValidation.commonSettingsSchema),
  auth("admin"),
  CommonController.createPrivacyPolicyInDB,
);

router.get("/privacy-policy", CommonController.getAllPrivacyPolicyFromDB);

router.patch(
  "/privacy-policy/update/:id",
  auth("admin"),
  CommonController.updatePrivacyPolicyInDB,
);

router.get("/support", CommonController.getSupport);
router.get("/all-parents", CommonController.getAllParents);
router.get("/all-teens", CommonController.getAllTeens);

export const CommonRoutes = router;
