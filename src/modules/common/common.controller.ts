import catchAsync from "./../../utils/catchAsync";
import sendResponse from "./../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import { Request, Response } from "express";
import { CommonService } from "./common.service";

// for admin setting common settings like about, terms, privacy part
// about us
const createAbout = catchAsync(async (req: Request, res: Response) => {
  const result = await CommonService.createAboutInDB(req.body);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.CREATED,
    message: "About created successfully.",
    data: result,
  });
});

const getAllAbout = catchAsync(async (req: Request, res: Response) => {
  const result = await CommonService.getAllAboutFromDB();

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "About retrieved successfully.",
    data: result,
  });
});

const updateAbout = catchAsync(async (req: Request, res: Response) => {
  const aboutId: string = req.params.id;

  const result = await CommonService.updateAboutInDB(req.body, aboutId);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "About updated successfully.",
    data: result,
  });
});

// terms and conditions
const createTermsInDB = catchAsync(async (req: Request, res: Response) => {
  const result = await CommonService.createTermsInDB(req.body);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.CREATED,
    message: "Terms created successfully.",
    data: result,
  });
});

const getAllTermsFromDB = catchAsync(async (req: Request, res: Response) => {
  const result = await CommonService.getAllTermsFromDB();

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Terms retrieved successfully.",
    data: result,
  });
});

const updateTermsInDB = catchAsync(async (req: Request, res: Response) => {
  const termsId: string = req.params.id;

  const result = await CommonService.updateTermsInDB(req.body, termsId);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Terms updated successfully.",
    data: result,
  });
});

// privacy policy
const createPrivacyPolicyInDB = catchAsync(
  async (req: Request, res: Response) => {
    const result = await CommonService.createPrivacyPolicyInDB(req.body);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: "Privacy policy created successfully.",
      data: result,
    });
  },
);

const getAllPrivacyPolicyFromDB = catchAsync(
  async (req: Request, res: Response) => {
    const result = await CommonService.getAllPrivacyPolicyFromDB();

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Privacy policy retrieved successfully.",
      data: result,
    });
  },
);

const updatePrivacyPolicyInDB = catchAsync(
  async (req: Request, res: Response) => {
    const privacyPolicyId: string = req.params.id;

    const result = await CommonService.updatePrivacyPolicyInDB(
      req.body,
      privacyPolicyId,
    );

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Terms updated successfully.",
      data: result,
    });
  },
);

const getSupport = catchAsync(async (req: Request, res: Response) => {
  const result = await CommonService.getSupport();

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Support retrieved successfully.",
    data: result,
  });
});

const getAllParents = catchAsync(async (req: Request, res: Response) => {
  const { search } = req.query;
  const result = await CommonService.getAllParents(search as string);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "All parents retrieved successfully.",
    data: result,
  });
});

const getAllTeens = catchAsync(async (req: Request, res: Response) => {
  const { search } = req.query;
  const result = await CommonService.getAllTeens(search as string);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "All teens retrieved successfully.",
    data: result,
  });
});

export const CommonController = {
  // about us
  createAbout,
  getAllAbout,
  updateAbout,

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
