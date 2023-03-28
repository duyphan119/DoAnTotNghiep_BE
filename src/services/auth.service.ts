import * as jwt from "jsonwebtoken";
class AuthService {
  accessTokenExpiresIn: number;
  refreshTokenExpiresIn: number;
  constructor() {
    this.accessTokenExpiresIn = 6000;
    this.refreshTokenExpiresIn = 1000 * 60 * 60 * 24 * 365;
  }

  signAccessToken(obj: { id: number; isAdmin: boolean }) {
    return jwt.sign(obj, process.env.AT_SECRET as string, {
      expiresIn: this.accessTokenExpiresIn,
    });
  }

  signRefreshToken(obj: { id: number; isAdmin: boolean }) {
    return jwt.sign(obj, process.env.RT_SECRET as string, {
      expiresIn: this.refreshTokenExpiresIn,
    });
  }

  verifyRefreshToken(refreshToken: string) {
    return jwt.verify(refreshToken, process.env.RT_SECRET as string);
  }
}

const authService = new AuthService();

export default authService;
