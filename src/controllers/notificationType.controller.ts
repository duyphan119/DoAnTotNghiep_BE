import { Request, Response } from "express";
import {
  STATUS_CREATED,
  STATUS_INTERVAL_ERROR,
  STATUS_NOTFOUND,
  STATUS_OK,
} from "../constantList";
import notificationTypeService from "../services/notificationType.service";
import helper from "../utils";

class NotificationTypeController {
  async getAll(req: Request, res: Response) {
    const data = await notificationTypeService.getAll(req.query);
    return res.status(STATUS_OK).json(helper.responseSuccess(data));
  }
  async getById(req: Request, res: Response) {
    const data = await notificationTypeService.getById(+req.params.id);
    if (!data) {
      return res.status(STATUS_NOTFOUND).json(helper.responseError());
    }
    return res.status(STATUS_OK).json(helper.responseSuccess(data));
  }
  async createOne(req: Request, res: Response) {
    const data = await notificationTypeService.createOne(req.body);
    if (!data) {
      return res.status(STATUS_INTERVAL_ERROR).json(helper.responseError());
    }
    return res.status(STATUS_CREATED).json(helper.responseSuccess(data));
  }
  async createMany(req: Request, res: Response) {
    const data = await notificationTypeService.createMany(req.body.inputs);
    if (!data) {
      return res.status(STATUS_INTERVAL_ERROR).json(helper.responseError());
    }
    return res.status(STATUS_CREATED).json(helper.responseSuccess(data));
  }
  async updateOne(req: Request, res: Response) {
    const data = await notificationTypeService.updateOne(
      +req.params.id,
      req.body
    );
    if (!data) {
      return res.status(STATUS_INTERVAL_ERROR).json(helper.responseError());
    }
    return res.status(STATUS_OK).json(helper.responseSuccess(data));
  }
  async updateMany(req: Request, res: Response) {
    const data = await notificationTypeService.updateMany(req.body.inputs);
    if (!data) {
      return res.status(STATUS_INTERVAL_ERROR).json(helper.responseError());
    }
    return res.status(STATUS_OK).json(helper.responseSuccess(data));
  }
  async deleteOne(req: Request, res: Response) {
    const result = await notificationTypeService.deleteOne(+req.params.id);
    if (!result) {
      return res.status(STATUS_INTERVAL_ERROR).json(helper.responseError());
    }
    return res.status(STATUS_OK).json(helper.responseSuccess());
  }
  async deleteMany(req: Request, res: Response) {
    const result = await notificationTypeService.deleteMany(
      JSON.parse(req.query.listId + "")
    );
    if (!result) {
      return res.status(STATUS_INTERVAL_ERROR).json(helper.responseError());
    }
    return res.status(STATUS_OK).json(helper.responseSuccess());
  }
  async softDeleteOne(req: Request, res: Response) {
    const result = await notificationTypeService.softDeleteOne(+req.params.id);
    if (!result) {
      return res.status(STATUS_INTERVAL_ERROR).json(helper.responseError());
    }
    return res.status(STATUS_OK).json(helper.responseSuccess());
  }
  async softDeleteMany(req: Request, res: Response) {
    const result = await notificationTypeService.softDeleteMany(
      JSON.parse(req.query.listId + "")
    );
    if (!result) {
      return res.status(STATUS_INTERVAL_ERROR).json(helper.responseError());
    }
    return res.status(STATUS_OK).json(helper.responseSuccess());
  }
  async restoreOne(req: Request, res: Response) {
    const result = await notificationTypeService.restoreOne(+req.params.id);
    if (!result) {
      return res.status(STATUS_INTERVAL_ERROR).json(helper.responseError());
    }
    return res.status(STATUS_OK).json(helper.responseSuccess());
  }
  async restoreMany(req: Request, res: Response) {
    const result = await notificationTypeService.restoreMany(
      JSON.parse(req.query.listId + "")
    );
    if (!result) {
      return res.status(STATUS_INTERVAL_ERROR).json(helper.responseError());
    }
    return res.status(STATUS_OK).json(helper.responseSuccess());
  }
}

const notificationTypeController = new NotificationTypeController();

export default notificationTypeController;
