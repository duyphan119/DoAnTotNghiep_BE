import { Request, Response } from "express";
import {
  EMPTY_ITEMS,
  MSG_ERROR,
  MSG_SUCCESS,
  STATUS_CREATED,
  STATUS_INTERVAL_ERROR,
  STATUS_OK,
  STATUS_UNAUTH,
} from "../constantList";
import userAddressService from "../services/userAddress.service";

class GroupProductController {
  async getByUserId(req: Request, res: Response) {
    if (!res.locals.user)
      return res
        .status(STATUS_OK)
        .json({ data: EMPTY_ITEMS, message: MSG_ERROR });
    const data = await userAddressService.getByUserId(
      +res.locals.user.id,
      req.query
    );
    if (!data) {
      return res
        .status(STATUS_OK)
        .json({ data: EMPTY_ITEMS, message: MSG_ERROR });
    }
    return res.status(STATUS_OK).json({ data, message: MSG_SUCCESS });
  }
  async createUserAddress(req: Request, res: Response) {
    const data = await userAddressService.createUserAddress(
      +res.locals.user.id,
      req.body
    );
    if (!data) {
      return res.status(STATUS_INTERVAL_ERROR).json({ message: MSG_SUCCESS });
    }
    return res.status(STATUS_CREATED).json({ data, message: MSG_SUCCESS });
  }
  async updateUserAddress(req: Request, res: Response) {
    const data = await userAddressService.updateUserAddress(
      +req.params.id,
      +res.locals.user.id,
      req.body
    );
    if (!data) {
      return res.status(STATUS_INTERVAL_ERROR).json({ message: MSG_SUCCESS });
    }
    return res.status(STATUS_OK).json({ data, message: MSG_SUCCESS });
  }
  async deleteUserAddress(req: Request, res: Response) {
    const result = await userAddressService.deleteUserAddress(
      +req.params.id,
      +res.locals.user.id
    );
    if (!result) {
      return res.status(STATUS_UNAUTH).json({ message: MSG_SUCCESS });
    }
    return res.status(STATUS_OK).json({ message: MSG_SUCCESS });
  }
}

export default new GroupProductController();
