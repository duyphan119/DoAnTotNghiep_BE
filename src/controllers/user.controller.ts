import { Request, Response } from "express";
import {
  MSG_SUCCESS,
  STATUS_CREATED,
  STATUS_INTERVAL_ERROR,
  STATUS_OK,
  STATUS_UNAUTH,
} from "../constants";
import userService from "../services/user.service";

class UserController {
  async getAllUsers(req: Request, res: Response) {
    const { data, error } = await userService.getAllUsers(
      req.query,
      res.locals.user ? res.locals.user.isAdmin : false
    );
    if (error) {
      return res.status(STATUS_INTERVAL_ERROR).json(error);
    }
    return res.status(STATUS_OK).json({ data, message: MSG_SUCCESS });
  }
  async getById(req: Request, res: Response) {
    const { error, data } = await userService.getById(+req.params.id);
    if (error) {
      return res.status(STATUS_INTERVAL_ERROR).json(error);
    }
    return res.status(STATUS_OK).json({ data, message: MSG_SUCCESS });
  }
  async createUser(req: Request, res: Response) {
    const { error, data } = await userService.createUser(req.body);
    if (error) {
      return res.status(STATUS_INTERVAL_ERROR).json(error);
    }
    return res.status(STATUS_CREATED).json({ data, message: MSG_SUCCESS });
  }
  async updateUser(req: Request, res: Response) {
    const { error, data } = await userService.updateUser(
      +req.params.id,
      req.body
    );
    if (error) {
      return res.status(STATUS_INTERVAL_ERROR).json(error);
    }
    return res.status(STATUS_OK).json({ data, message: MSG_SUCCESS });
  }
  async deleteUser(req: Request, res: Response) {
    const { error } = await userService.deleteUser(+req.params.id);
    if (error) {
      return res.status(STATUS_UNAUTH).json(error);
    }
    return res.status(STATUS_OK).json({ message: MSG_SUCCESS });
  }
  async softDeleteUser(req: Request, res: Response) {
    const { error } = await userService.softDeleteUser(+req.params.id);
    if (error) {
      return res.status(STATUS_UNAUTH).json(error);
    }
    return res.status(STATUS_OK).json({ message: MSG_SUCCESS });
  }
  async restoreUser(req: Request, res: Response) {
    const { error } = await userService.restoreUser(+req.params.id);
    if (error) {
      return res.status(STATUS_UNAUTH).json(error);
    }
    return res.status(STATUS_OK).json({ message: MSG_SUCCESS });
  }
  async seed(req: Request, res: Response) {
    const { error, data } = await userService.seed();
    if (error) {
      return res.status(STATUS_INTERVAL_ERROR).json(error);
    }
    return res.status(STATUS_CREATED).json({ data, message: MSG_SUCCESS });
  }
}
export default new UserController();
