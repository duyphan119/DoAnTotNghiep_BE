import { Request, Response } from "express";
import {
  STATUS_CREATED,
  STATUS_INTERVAL_ERROR,
  STATUS_NOTFOUND,
  STATUS_OK,
} from "../constantList";
import repCommentProductService from "../services/repCommentProduct.service";
import helper from "../utils";

class RepCommentProductController {
  async getAll(req: Request, res: Response) {
    const data = await repCommentProductService.getAll(req.query);
    return res.status(STATUS_OK).json(helper.responseSuccess(data));
  }
  async getById(req: Request, res: Response) {
    const data = await repCommentProductService.getById(+req.params.id);
    if (!data) {
      return res.status(STATUS_NOTFOUND).json(helper.responseError());
    }
    return res.status(STATUS_OK).json(helper.responseSuccess(data));
  }
  async createOne(req: Request, res: Response) {
    const data = await repCommentProductService.createOne({
      ...req.body,
      userId: +res.locals.user.id,
    });
    if (!data) {
      return res.status(STATUS_INTERVAL_ERROR).json(helper.responseError());
    }
    return res.status(STATUS_CREATED).json(helper.responseSuccess(data));
  }
  async createMany(req: Request, res: Response) {
    const data = await repCommentProductService.createMany(
      req.body.inputs.map((input: any) => ({
        ...input,
        userId: +res.locals.user.id,
      }))
    );
    if (!data) {
      return res.status(STATUS_INTERVAL_ERROR).json(helper.responseError());
    }
    return res.status(STATUS_CREATED).json(helper.responseSuccess(data));
  }
  async updateOne(req: Request, res: Response) {
    const data = await repCommentProductService.updateOne(
      +req.params.id,
      req.body
    );
    if (!data) {
      return res.status(STATUS_INTERVAL_ERROR).json(helper.responseError());
    }
    return res.status(STATUS_OK).json(helper.responseSuccess(data));
  }
  async updateMany(req: Request, res: Response) {
    const data = await repCommentProductService.updateMany(req.body.inputs);
    if (!data) {
      return res.status(STATUS_INTERVAL_ERROR).json(helper.responseError());
    }
    return res.status(STATUS_OK).json(helper.responseSuccess(data));
  }
  async deleteOne(req: Request, res: Response) {
    const item = await repCommentProductService.getById(+req.params.id);
    const userId = +res.locals.user.id;
    if (item && userId === item.userId) {
      const result = await repCommentProductService.deleteOne(+req.params.id);
      if (result) return res.status(STATUS_OK).json(helper.responseSuccess());
    }
    return res.status(STATUS_INTERVAL_ERROR).json(helper.responseError());
  }
  async deleteMany(req: Request, res: Response) {
    const result = await repCommentProductService.deleteMany(
      JSON.parse(req.query.listId + "")
    );
    if (!result) {
      return res.status(STATUS_INTERVAL_ERROR).json(helper.responseError());
    }
    return res.status(STATUS_OK).json(helper.responseSuccess());
  }
  async softDeleteOne(req: Request, res: Response) {
    const item = await repCommentProductService.getById(+req.params.id);
    const userId = +res.locals.user.id;
    if (item && userId === item.userId) {
      const result = await repCommentProductService.softDeleteOne(
        +req.params.id
      );
      if (result) return res.status(STATUS_OK).json(helper.responseSuccess());
    }
    return res.status(STATUS_INTERVAL_ERROR).json(helper.responseError());
  }
  async softDeleteMany(req: Request, res: Response) {
    const result = await repCommentProductService.softDeleteMany(
      JSON.parse(req.query.listId + "")
    );
    if (!result) {
      return res.status(STATUS_INTERVAL_ERROR).json(helper.responseError());
    }
    return res.status(STATUS_OK).json(helper.responseSuccess());
  }
  async restoreOne(req: Request, res: Response) {
    const item = await repCommentProductService.getById(+req.params.id);
    const userId = +res.locals.user.id;
    if (item && userId === item.userId) {
      const result = await repCommentProductService.restoreOne(+req.params.id);
      if (result) return res.status(STATUS_OK).json(helper.responseSuccess());
    }
    return res.status(STATUS_INTERVAL_ERROR).json(helper.responseError());
  }
  async restoreMany(req: Request, res: Response) {
    const result = await repCommentProductService.restoreMany(
      JSON.parse(req.query.listId + "")
    );
    if (!result) {
      return res.status(STATUS_INTERVAL_ERROR).json(helper.responseError());
    }
    return res.status(STATUS_OK).json(helper.responseSuccess());
  }
}

const repCommentProductController = new RepCommentProductController();

export default repCommentProductController;
