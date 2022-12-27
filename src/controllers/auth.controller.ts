import { Response, Request } from "express";
import {
  COOKIE_REFRESH_TOKEN_NAME,
  MSG_SUCCESS,
  STATUS_CREATED,
  STATUS_INTERVAL_ERROR,
  STATUS_OK,
  __prod__,
} from "../constants";
import authService from "../services/auth.service";
import userService from "../services/user.service";

class AuthController {
  writeRefreshTokenCookie(res: Response, refreshToken: string) {
    res.cookie(COOKIE_REFRESH_TOKEN_NAME, refreshToken, {
      maxAge: 1000 * 60 * 60 * 24 * 365,
      httpOnly: true,
      secure: __prod__,
      sameSite: "lax",
      domain: __prod__ ? ".vercel.app" : undefined,
    });
  }

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
        this.writeRefreshTokenCookie(res, refreshToken);
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
        this.writeRefreshTokenCookie(res, refreshToken);
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
      const token = req.cookies[COOKIE_REFRESH_TOKEN_NAME];
      if (token) {
        const payload = authService.verifyRefreshToken(token);
        const accessToken = authService.signAccessToken(payload);
        return res.status(STATUS_OK).json({ data: { accessToken } });
      }
      return res
        .status(STATUS_INTERVAL_ERROR)
        .json({ error: { message: "Token is invalid" } });
    } catch (error) {
      return res.status(STATUS_INTERVAL_ERROR).json({ error });
    }
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
    res.status(STATUS_OK).json({ data: { message: "Log out success" } });
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
