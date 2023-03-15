import { NextFunction, Response, Request } from "express";
import jwt from "jsonwebtoken";
import { COOKIE_REFRESH_TOKEN_NAME, STATUS_UNAUTH } from "../constantList";

export const getUser: any = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const refreshToken = req.cookies[COOKIE_REFRESH_TOKEN_NAME];
    if (refreshToken) {
      try {
        const user = jwt.verify(
          refreshToken,
          process.env.RT_SECRET || "super-secret"
        );
        res.locals.user = user || null;
      } catch (error) {
        console.log("ERROR", error);
      }
    }
  } catch (error) {
  } finally {
    next();
  }
};

export const requireEqualUserIdParam = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  getUser(req, res, () => {
    if (res.locals.user.id === req.params.userId) next();
    else res.status(STATUS_UNAUTH).json({ message: "UserId is invalid" });
  });
};

export const requireLogin: any = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const reqHeader = req.headers["authorization"];
  if (reqHeader) {
    const accessToken = reqHeader.split(" ")[1];
    if (accessToken) {
      try {
        const user = jwt.verify(accessToken, process.env.AT_SECRET || "123");
        res.locals.user = user;
        next();
        return;
      } catch (error) {
        console.log(error);
      }
    }
  }
  return res.status(401).json({ message: "Unauthorized" });
};

export const requireIsAdmin: any = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  requireLogin(req, res, () => {
    if (res.locals.user.isAdmin) {
      next();
    } else {
      return res.status(401).json({ message: "Unauthorized" });
    }
  });
};

export const requireIsUser: any = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  requireLogin(req, res, () => {
    if (!res.locals.user.isAdmin) {
      next();
    } else {
      return res.status(401).json({ message: "Unauthorized" });
    }
  });
};
