import { Request, Response } from "express";
import {
  STATUS_CREATED,
  STATUS_INTERVAL_ERROR,
  STATUS_OK,
  STATUS_UNAUTH,
} from "../constantList";
import settingWebsiteService from "../services/settingWebsite.service";
import helper from "../utils";

class SettingWebsiteController {
  async getAll(req: Request, res: Response) {
    const data = await settingWebsiteService.getAll(req.query);
    return res.status(STATUS_OK).json(helper.responseSuccess(data));
  }
  async getById(req: Request, res: Response) {
    const data = await settingWebsiteService.getById(+req.params.id);
    if (!data) {
      return res.status(STATUS_INTERVAL_ERROR).json(helper.responseError());
    }
    return res.status(STATUS_OK).json(helper.responseSuccess(data));
  }
  async getByKeys(req: Request, res: Response) {
    const data = await settingWebsiteService.getByKeys(req.body.keys);
    return res.status(STATUS_OK).json(helper.responseSuccess(data));
  }
  async createOne(req: Request, res: Response) {
    const data = await settingWebsiteService.createOne(req.body);
    if (!data) {
      return res.status(STATUS_INTERVAL_ERROR).json(helper.responseError());
    }
    return res.status(STATUS_CREATED).json(helper.responseSuccess(data));
  }
  async updateOne(req: Request, res: Response) {
    const data = await settingWebsiteService.updateOne(
      +req.params.id,
      req.body
    );
    if (!data) {
      return res.status(STATUS_INTERVAL_ERROR).json(helper.responseError());
    }
    return res.status(STATUS_OK).json(helper.responseSuccess(data));
  }
  async deleteOne(req: Request, res: Response) {
    const result = await settingWebsiteService.deleteOne(+req.params.id);
    if (!result) {
      return res.status(STATUS_UNAUTH).json(helper.responseError());
    }
    return res.status(STATUS_OK).json(helper.responseSuccess());
  }
  async seed(req: Request, res: Response) {
    const { error, data } = await settingWebsiteService.seed();
    if (error) {
      return res.status(STATUS_INTERVAL_ERROR).json(helper.responseError());
    }
    return res.status(STATUS_CREATED).json(helper.responseSuccess(data));
  }
}

const settingWebsiteController = new SettingWebsiteController();

export default settingWebsiteController;
