import { Request, Response, NextFunction, RequestHandler } from "express";
import jwt from "jsonwebtoken";

export interface JwtUserPayload {
  id: string;
  email: string;
  role: IRole;
}

export type IRole = "admin" | "parent" | "teen";

export const auth = (...roles: IRole[]): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(" ")[1] || req.cookies.token;
    // console.log(" token: ", token);

    if (!token) {
      console.log("Access denied. No token provided");
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided.",
      });
    }

    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET_KEY!,
      ) as JwtUserPayload;
      req.user = decoded; // now typed

      // Check roles
      if (roles.length > 0 && !roles.includes(decoded.role)) {
        console.log("You are not authorized");
        return res.status(403).json({
          success: false,
          message: "You are not authorized",
        });
      }

      next();
    } catch (error) {
      console.log("Invalid token.");
      return res.status(400).json({
        success: false,
        message: "Invalid token.",
      });
    }
  };
};
