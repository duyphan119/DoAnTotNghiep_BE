import { Request, Response } from "express";
import {
  MSG_ERROR,
  MSG_SUCCESS,
  STATUS_CREATED,
  STATUS_INTERVAL_ERROR,
  STATUS_OK,
  STATUS_UNAUTH,
} from "../constants";
import userAddressService from "../services/useraddress.service";

class GroupProductController {
  async getByUserId(req: Request, res: Response) {
    if (!res.locals.user)
      return res
        .status(STATUS_OK)
        .json({ data: { items: [], count: 0 }, message: MSG_ERROR });
    const { error, data } = await userAddressService.getByUserId(
      +res.locals.user.id,
      req.query
    );
    if (error) {
      return res
        .status(STATUS_OK)
        .json({ data: { items: [], count: 0 }, message: MSG_ERROR });
    }
    return res.status(STATUS_OK).json({ data, message: MSG_SUCCESS });
  }
  async createUserAddress(req: Request, res: Response) {
    const { error, data } = await userAddressService.createUserAddress(
      +res.locals.user.id,
      req.body
    );
    if (error) {
      return res.status(STATUS_INTERVAL_ERROR).json(error);
    }
    return res.status(STATUS_CREATED).json({ data, message: MSG_SUCCESS });
  }
  async updateUserAddress(req: Request, res: Response) {
    const { error, data } = await userAddressService.updateUserAddress(
      +req.params.id,
      +res.locals.user.id,
      req.body
    );
    if (error) {
      return res.status(STATUS_INTERVAL_ERROR).json(error);
    }
    return res.status(STATUS_OK).json({ data, message: MSG_SUCCESS });
  }
  async deleteUserAddress(req: Request, res: Response) {
    const { error } = await userAddressService.deleteUserAddress(
      +req.params.id,
      +res.locals.user.id
    );
    if (error) {
      return res.status(STATUS_UNAUTH).json(error);
    }
    return res.status(STATUS_OK).json({ message: MSG_SUCCESS });
  }
}

export default new GroupProductController();
