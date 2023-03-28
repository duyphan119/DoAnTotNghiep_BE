import { CookieOptions } from "express";
import authService from "./services/auth.service";

export const __prod__ =
  process.env.NODE__ENV === "production" ||
  process.env.NODE_ENV === "production";
export const COOKIE_REFRESH_TOKEN_NAME = "RT";
export const COOKIE_RESET_CODE_NAME = "RT";
export const BASE_ASSETS_IMAGES = "assets/images/";
export const OK = "OK";
export const STATUS_OK = 200;
export const STATUS_CREATED = 201;
export const STATUS_UNAUTH = 401;
export const STATUS_NOTFOUND = 404;
export const STATUS_INTERVAL_ERROR = 500;
export const STATUS_BAD_REQUEST = 400;
export const MSG_SUCCESS = "Success";
export const MSG_ERROR = "Error";
export const COOKIE_REFRESH_TOKEN_OPTIONS: CookieOptions = {
  maxAge: authService.refreshTokenExpiresIn,
  httpOnly: true,
  secure: __prod__,
  sameSite: "lax",
  domain: __prod__ ? process.env.CORS_ORIGIN_PROD : process.env.CORS_ORIGIN_DEV,
};
export const EMPTY_ITEMS = { items: [], count: 0 };
export const ERROR_VALIDATION = "Validate";
