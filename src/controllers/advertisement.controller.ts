import { Request, Response } from "express";
import {
  MSG_ERROR,
  MSG_SUCCESS,
  STATUS_BAD_REQUEST,
  STATUS_CREATED,
  STATUS_INTERVAL_ERROR,
  STATUS_OK,
  STATUS_UNAUTH,
} from "../constantList";
import advertisementService from "../services/advertisement.service";
import helper from "../utils";

class AdvertisementController {
  async getAll(req: Request, res: Response) {
    const data = await advertisementService.getAll(req.query);
    return res.status(STATUS_OK).json(helper.responseSuccess(data));
  }
  async getById(req: Request, res: Response) {
    const data = await advertisementService.getById(+req.params.id);
    if (!data) {
      return res.status(STATUS_INTERVAL_ERROR).json(helper.responseError());
    }
    return res.status(STATUS_OK).json(helper.responseSuccess(data));
  }
  async createOne(req: Request, res: Response) {
    try {
      const data = await advertisementService.createOne(req.body);
      if (!data) {
        return res.status(STATUS_INTERVAL_ERROR).json(helper.responseError());
      }
      return res.status(STATUS_CREATED).json(helper.responseSuccess(data));
    } catch (error) {
      return res.status(STATUS_BAD_REQUEST).json(helper.responseError(error));
    }
  }
  async updateOne(req: Request, res: Response) {
    try {
      const data = await advertisementService.updateOne(
        +req.params.id,
        req.body
      );
      if (!data) {
        return res.status(STATUS_INTERVAL_ERROR).json(helper.responseError());
      }
      return res.status(STATUS_OK).json(helper.responseSuccess(data));
    } catch (error) {
      return res.status(STATUS_BAD_REQUEST).json(helper.responseError(error));
    }
  }
  async deleteOne(req: Request, res: Response) {
    const result = await advertisementService.deleteOne(+req.params.id);
    if (!result) {
      return res.status(STATUS_INTERVAL_ERROR).json(helper.responseError());
    }
    return res.status(STATUS_OK).json(helper.responseSuccess());
  }
  async deleteMany(req: Request, res: Response) {
    const result = await advertisementService.deleteMany(
      JSON.parse(req.query.listId + "")
    );
    if (!result) {
      return res.status(STATUS_INTERVAL_ERROR).json(helper.responseError());
    }
    return res.status(STATUS_OK).json(helper.responseSuccess());
  }
}

const advertisementController = new AdvertisementController();

export default advertisementController;
