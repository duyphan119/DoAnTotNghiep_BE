import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { __prod__ } from "../constants";
class AuthService {
  signAccessToken(obj: any, expiresIn?: number) {
    return jwt.sign(obj, process.env.AT_SECRET as string, {
      expiresIn: expiresIn || 6000,
    });
  }
  signRefreshToken(obj: any, expiresIn?: number) {
    return jwt.sign(obj, process.env.RT_SECRET as string, {
      expiresIn: expiresIn || 31536000000,
    });
  }
  verifyRefreshToken(refreshToken: string) {
    return jwt.verify(refreshToken, process.env.RT_SECRET as string);
  }
}

export default new AuthService();
