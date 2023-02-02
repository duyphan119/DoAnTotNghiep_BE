import { Response, Request } from "express";
import {
  COOKIE_REFRESH_TOKEN_NAME,
  COOKIE_REFRESH_TOKEN_OPTIONS,
  MSG_ERROR,
  MSG_SUCCESS,
  STATUS_CREATED,
  STATUS_INTERVAL_ERROR,
  STATUS_OK,
  __prod__,
} from "../constantList";
import authService from "../services/auth.service";
import userService from "../services/user.service";

class AuthController {
  async register(req: Request, res: Response) {
    const { email } = req.body;
    const { data } = await userService.getByEmail(email);
    let message = "Email is available";
    if (!data) {
      const { data } = await userService.createUser(req.body);
      if (data) {
        const payload = {
          id: data.id,
          isAdmin: data.isAdmin,
        };
        const accessToken = authService.signAccessToken(payload);
        const refreshToken = authService.signRefreshToken(payload);
        const { password: _password, ...hidedPasswordUser } = data;
        res.cookie(
          COOKIE_REFRESH_TOKEN_NAME,
          refreshToken,
          COOKIE_REFRESH_TOKEN_OPTIONS
        );
        return res.status(STATUS_CREATED).json({
          message: MSG_SUCCESS,
          data: { user: hidedPasswordUser, accessToken, refreshToken },
        });
      }
    }
    return res.status(STATUS_INTERVAL_ERROR).json({ error: { message } });
  }

  async login(req: Request, res: Response) {
    const { email, password } = req.body;
    const { data } = await userService.getByEmail(email);
    let message = "Email is incorrect";
    if (data) {
      const compareResult = await userService.comparePassword(
        password,
        data.password
      );
      message = "Password is incorrect";
      if (compareResult) {
        const payload = {
          id: data.id,
          isAdmin: data.isAdmin,
        };
        const accessToken = authService.signAccessToken(payload);
        const refreshToken = authService.signRefreshToken(payload);
        const { password: _password, ...hidedPasswordUser } = data;
        res.cookie(
          COOKIE_REFRESH_TOKEN_NAME,
          refreshToken,
          COOKIE_REFRESH_TOKEN_OPTIONS
        );
        return res.status(STATUS_OK).json({
          message: MSG_SUCCESS,
          data: { user: hidedPasswordUser, accessToken, refreshToken },
        });
      }
    }
    return res.status(STATUS_INTERVAL_ERROR).json({ error: { message } });
  }

  async refreshToken(req: Request, res: Response) {
    try {
      const token =
        req.cookies[COOKIE_REFRESH_TOKEN_NAME] || req.body.refreshToken;
      if (token) {
        const payload: any = authService.verifyRefreshToken(token);
        const accessToken = authService.signAccessToken({
          isAdmin: payload.isAdmin,
          id: payload.id,
        });
        res.cookie("accessToken", accessToken, {
          maxAge: 6000,
        });
        return res
          .status(STATUS_OK)
          .json({ data: { accessToken }, message: MSG_SUCCESS });
      }
      return res
        .status(STATUS_INTERVAL_ERROR)
        .json({ error: { message: "Token is invalid" } });
    } catch (error) {
      console.log("REFRESH TOKEN ERROR", error);
      return res.status(STATUS_INTERVAL_ERROR).json({ error });
    }
  }

  async getProfile(req: Request, res: Response) {
    if (!res.locals.user)
      return res.status(STATUS_OK).json({ data: null, message: MSG_ERROR });
    const userId = +res.locals.user.id;
    const { data, error } = await userService.getById(userId);

    if (error) {
      return res.status(STATUS_OK).json({ data: null, message: MSG_ERROR });
    }

    return res.status(STATUS_OK).json({ data, message: MSG_SUCCESS });
  }

  async changeProfile(req: Request, res: Response) {
    const userId = +res.locals.user.id;

    const { data, error } = await userService.updateUser(userId, req.body);

    if (data) {
      return res.status(STATUS_OK).json({ data, message: MSG_SUCCESS });
    }
    return res.status(STATUS_INTERVAL_ERROR).json({ error });
  }

  logout(req: Request, res: Response) {
    res.clearCookie(COOKIE_REFRESH_TOKEN_NAME);
    res.status(STATUS_OK).json({ message: MSG_SUCCESS });
  }

  async changePassword(req: Request, res: Response) {
    const userId = +res.locals.user.id;
    const { oldPassword, newPassword } = req.body;
    const { data, error } = await userService.changePassword(
      userId,
      newPassword,
      oldPassword
    );
    if (data) {
      return res.status(STATUS_OK).json({ message: MSG_SUCCESS });
    }
    return res.status(STATUS_INTERVAL_ERROR).json({ error });
  }
}

export default new AuthController();
