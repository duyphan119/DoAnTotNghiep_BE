import { Request, Response } from "express";
import {
  EMPTY_ITEMS,
  MSG_ERROR,
  STATUS_CREATED,
  STATUS_INTERVAL_ERROR,
  STATUS_OK,
  STATUS_UNAUTH,
} from "../constantList";
import userAddressService from "../services/userAddress.service";
import helper from "../utils";

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
    return res.status(STATUS_OK).json(helper.responseSuccess(data));
  }
  async createOne(req: Request, res: Response) {
    const data = await userAddressService.createOne({
      userId: +res.locals.user.id,
      ...req.body,
    });
    if (!data) {
      return res.status(STATUS_INTERVAL_ERROR).json(helper.responseSuccess());
    }
    return res.status(STATUS_CREATED).json(helper.responseSuccess(data));
  }
  async updateOne(req: Request, res: Response) {
    const id = +req.params.id;
    const data = await userAddressService.getById(id);
    const userId = +res.locals.user.id;
    if (data && data.userId === userId) {
      const item = await userAddressService.updateOne(id, {
        userId,
        ...req.body,
      });
      if (item) {
        return res.status(STATUS_OK).json(helper.responseSuccess(data));
      }
    }
    return res.status(STATUS_INTERVAL_ERROR).json(helper.responseSuccess());
  }
  async deleteOne(req: Request, res: Response) {
    const id = +req.params.id;
    const data = await userAddressService.getById(id);
    if (data && data.userId === +res.locals.user.id) {
      const result = await userAddressService.deleteOne(id);
      if (result) {
        return res.status(STATUS_OK).json(helper.responseSuccess());
      }
    }
    return res.status(STATUS_UNAUTH).json(helper.responseSuccess());
  }
}

export default new GroupProductController();
