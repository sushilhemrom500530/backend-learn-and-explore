import AppError from "./../../errors/AppError";
import { StatusCodes } from "http-status-codes";
import { ICommonSettings } from "./common.interface";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { About, Terms, Privacy } from "./common.model";
import { htmlToText } from "./common.utils";
import { SUPPORT_PHONE, SUPPORT_EMAIL } from "./../../config/index";
import { User } from "./../user/user.model";

dayjs.extend(relativeTime);

// for admin setting common settings like about, terms, privacy part
// about us
const createAboutInDB = async (aboutData: ICommonSettings) => {
  const existsAbout = await About.findOne();
  if (existsAbout) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Privacy already exists");
  }
  const payload = {
    content: aboutData.content,
    description: htmlToText(aboutData.content),
  };
  const newAbout = new About(payload);
  const savedAbout = await newAbout.save();
  return savedAbout;
};

const getAllAboutFromDB = async () => {
  const about = await About.find().sort({ createdAt: -1 });
  const result = about.map((item) => ({
    ...item.toObject(),
    published: item?.updated_at ? dayjs(item?.updated_at).fromNow() : null,
  }));

  return result;
};

const updateAboutInDB = async (newData: ICommonSettings, aboutId: string) => {
  const isAboutExist = await About.findById(aboutId);
  if (!isAboutExist) {
    throw new AppError(StatusCodes.NOT_FOUND, "About not found");
  }

  const updatePayload: Partial<ICommonSettings> = {};

  if (newData.content && typeof newData.content === "string") {
    updatePayload.content = newData.content; // RAW HTML
    updatePayload.description = htmlToText(newData.content);
  }

  const updatedAbout = await About.findOneAndUpdate(
    { _id: aboutId },
    updatePayload,
    { new: true },
  );

  return updatedAbout;
};

// terms and conditions
const createTermsInDB = async (termsData: ICommonSettings) => {
  const existsTerms = await Terms.findOne();
  if (existsTerms) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Terms already exists");
  }
  const payload = {
    content: termsData.content,
    description: htmlToText(termsData.content),
  };
  const newTerms = new Terms(payload);
  const savedTerms = await newTerms.save();
  return savedTerms;
};

const getAllTermsFromDB = async () => {
  const terms = await Terms.find().sort({ createdAt: -1 });
  const result = terms.map((item) => ({
    ...item.toObject(),
    published: item?.updated_at ? dayjs(item?.updated_at).fromNow() : null,
  }));

  return result;
};

const updateTermsInDB = async (termsData: ICommonSettings, termsId: string) => {
  const isTermsExist = await Terms.findById(termsId);
  if (!isTermsExist) {
    throw new AppError(StatusCodes.NOT_FOUND, "Terms not found");
  }

  const updatePayload: Partial<ICommonSettings> = {};

  if (termsData.content && typeof termsData.content === "string") {
    updatePayload.content = termsData.content;
    updatePayload.description = htmlToText(termsData.content);
  }

  const updatedTerms = await Terms.findOneAndUpdate(
    { _id: termsId },
    updatePayload,
    { new: true, upsert: true },
  );

  return updatedTerms;
};

// privacy policy
const createPrivacyPolicyInDB = async (privacyPolicyData: ICommonSettings) => {
  const existsPrivacyPolicy = await Privacy.findOne();
  if (existsPrivacyPolicy) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "Privacy policy already exists",
    );
  }
  const payload = {
    content: privacyPolicyData.content,
    description: htmlToText(privacyPolicyData.content),
  };
  const newPrivacyPolicy = new Privacy(payload);
  const savedPrivacyPolicy = await newPrivacyPolicy.save();
  return savedPrivacyPolicy;
};

const getAllPrivacyPolicyFromDB = async () => {
  const privacyPolicy = await Privacy.find().sort({ createdAt: -1 });
  const result = privacyPolicy.map((item) => ({
    ...item.toObject(),
    published: item?.updated_at ? dayjs(item?.updated_at).fromNow() : null,
  }));

  return result;
};

const updatePrivacyPolicyInDB = async (
  privacyPolicyData: ICommonSettings,
  privacyPolicyId: string,
) => {
  const isPrivacyPolicyExist = await Privacy.findById(privacyPolicyId);
  if (!isPrivacyPolicyExist) {
    throw new AppError(StatusCodes.NOT_FOUND, "Privacy policy not found");
  }

  const updatePayload: Partial<ICommonSettings> = {};

  if (
    privacyPolicyData.content &&
    typeof privacyPolicyData.content === "string"
  ) {
    updatePayload.content = privacyPolicyData.content;
    updatePayload.description = htmlToText(privacyPolicyData.content);
  }

  const updatedPrivacyPolicy = await Privacy.findOneAndUpdate(
    { _id: privacyPolicyId },
    updatePayload,
    { new: true, upsert: true },
  );

  return updatedPrivacyPolicy;
};

const getSupport = async () => {
  return {
    email: SUPPORT_EMAIL,
    phone: SUPPORT_PHONE,
  };
};

const getAllParents = async (search: string) => {
  if (!search || search.trim() === "") {
    return [];
  }

  const parents = await User.find({
    role: "parent",
    $or: [
      { fullName: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ],
  }).select("fullName email profilePhoto");

  return parents;
};
const getAllTeens = async (search: string) => {
  if (!search || search.trim() === "") {
    return [];
  }

  const teens = await User.find({
    role: "teen",
    $or: [
      { fullName: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ],
  }).select("fullName email profilePhoto");
  return teens;
};

export const CommonService = {
  // about us
  createAboutInDB,
  getAllAboutFromDB,
  updateAboutInDB,

  // terms and conditions
  createTermsInDB,
  getAllTermsFromDB,
  updateTermsInDB,

  // privacy policy
  createPrivacyPolicyInDB,
  getAllPrivacyPolicyFromDB,
  updatePrivacyPolicyInDB,

  // support
  getSupport,

  // common api
  getAllParents,
  getAllTeens,
};
