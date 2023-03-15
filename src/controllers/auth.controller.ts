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
    const user = await userService.getByEmail(email);
    let message = "Email is available";
    if (!user) {
      const newUser = await userService.createOne(req.body);
      if (newUser) {
        const payload = {
          id: newUser.id,
          isAdmin: newUser.isAdmin,
        };
        const accessToken = authService.signAccessToken(payload);
        const refreshToken = authService.signRefreshToken(payload);
        const { password: _password, ...hidedPasswordUser } = newUser;
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
    const user = await userService.getByEmail(email);
    let message = "Email is incorrect";
    if (user) {
      const compareResult = await userService.comparePassword(
        password,
        user.password
      );
      message = "Password is incorrect";
      if (compareResult) {
        const payload = {
          id: user.id,
          isAdmin: user.isAdmin,
        };
        const accessToken = authService.signAccessToken(payload);
        const refreshToken = authService.signRefreshToken(payload);
        const { password: _password, ...hidedPasswordUser } = user;
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
        .status(STATUS_OK)
        .json({ message: "Token is invalid", data: null });
    } catch (error) {
      console.log("REFRESH TOKEN ERROR", error);
      return res.status(STATUS_INTERVAL_ERROR).json({ error });
    }
  }

  async getProfile(req: Request, res: Response) {
    if (!res.locals.user)
      return res.status(STATUS_OK).json({ data: null, message: MSG_ERROR });
    const userId = +res.locals.user.id;
    const data = await userService.getById(userId);

    if (!data) {
      return res.status(STATUS_OK).json({ data: null, message: MSG_ERROR });
    }

    return res.status(STATUS_OK).json({ data, message: MSG_SUCCESS });
  }

  async changeProfile(req: Request, res: Response) {
    const userId = +res.locals.user.id;

    const data = await userService.updateOne(userId, req.body);

    if (!data) {
      return res.status(STATUS_INTERVAL_ERROR).json({ message: MSG_ERROR });
    }
    return res.status(STATUS_OK).json({ data, message: MSG_SUCCESS });
  }

  logout(req: Request, res: Response) {
    res.clearCookie(COOKIE_REFRESH_TOKEN_NAME);
    res.status(STATUS_OK).json({ message: MSG_SUCCESS });
  }

  async changePassword(req: Request, res: Response) {
    const userId = +res.locals.user.id;
    const { oldPassword, newPassword } = req.body;
    const result = await userService.changePassword(
      userId,
      newPassword,
      oldPassword
    );
    if (!result) {
      return res.status(STATUS_INTERVAL_ERROR).json({ message: MSG_ERROR });
    }
    return res.status(STATUS_OK).json({ message: MSG_SUCCESS });
  }
}

const authController = new AuthController();

export default authController;
