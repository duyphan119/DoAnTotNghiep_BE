import { Request, Response } from "express";
import {
  MSG_SUCCESS,
  STATUS_BAD_REQUEST,
  STATUS_CREATED,
  STATUS_INTERVAL_ERROR,
  STATUS_NOTFOUND,
  STATUS_OK,
} from "../constantList";
import variantValueService from "../services/variantValue.service";
import helper from "../utils";

class VariantValueController {
  async getAll(req: Request, res: Response) {
    const data = await variantValueService.getAll(req.query);
    return res.status(STATUS_OK).json(helper.responseSuccess(data));
  }
  async getById(req: Request, res: Response) {
    const data = await variantValueService.getById(+req.params.id);
    if (!data) {
      return res.status(STATUS_NOTFOUND).json(helper.responseError());
    }
    return res.status(STATUS_OK).json(helper.responseSuccess(data));
  }
  async createOne(req: Request, res: Response) {
    try {
      const data = await variantValueService.createOne(req.body);
      if (!data) {
        return res.status(STATUS_INTERVAL_ERROR).json(helper.responseError());
      }
      return res.status(STATUS_CREATED).json(helper.responseSuccess(data));
    } catch (error) {
      return res.status(STATUS_BAD_REQUEST).json(error);
    }
  }
  async createMany(req: Request, res: Response) {
    try {
      const data = await variantValueService.createMany(req.body.inputs);
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
      const data = await variantValueService.updateOne(
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
  async updateMany(req: Request, res: Response) {
    try {
      const data = await variantValueService.updateMany(req.body.inputs);
      if (!data) {
        return res.status(STATUS_INTERVAL_ERROR).json(helper.responseError());
      }
      return res.status(STATUS_OK).json(helper.responseSuccess(data));
    } catch (error) {
      return res.status(STATUS_BAD_REQUEST).json(helper.responseError(error));
    }
  }
  async deleteOne(req: Request, res: Response) {
    const result = await variantValueService.deleteOne(+req.params.id);
    if (!result) {
      return res.status(STATUS_INTERVAL_ERROR).json(helper.responseError());
    }
    return res.status(STATUS_OK).json(helper.responseSuccess());
  }
  async deleteMany(req: Request, res: Response) {
    const result = await variantValueService.deleteMany(
      JSON.parse(req.query.listId + "")
    );
    if (!result) {
      return res.status(STATUS_INTERVAL_ERROR).json(helper.responseError());
    }
    return res.status(STATUS_OK).json(helper.responseSuccess());
  }
  async softDeleteOne(req: Request, res: Response) {
    const result = await variantValueService.softDeleteOne(+req.params.id);
    if (!result) {
      return res.status(STATUS_INTERVAL_ERROR).json(helper.responseError());
    }
    return res.status(STATUS_OK).json(helper.responseSuccess());
  }
  async softDeleteMany(req: Request, res: Response) {
    const result = await variantValueService.softDeleteMany(
      JSON.parse(req.query.listId + "")
    );
    if (!result) {
      return res.status(STATUS_INTERVAL_ERROR).json(helper.responseError());
    }
    return res.status(STATUS_OK).json(helper.responseSuccess());
  }
  async restoreOne(req: Request, res: Response) {
    const result = await variantValueService.restoreOne(+req.params.id);
    if (!result) {
      return res.status(STATUS_INTERVAL_ERROR).json(helper.responseError());
    }
    return res.status(STATUS_OK).json(helper.responseSuccess());
  }
  async restoreMany(req: Request, res: Response) {
    const result = await variantValueService.restoreMany(
      JSON.parse(req.query.listId + "")
    );
    if (!result) {
      return res.status(STATUS_INTERVAL_ERROR).json(helper.responseError());
    }
    return res.status(STATUS_OK).json(helper.responseSuccess());
  }
  async seed(req: Request, res: Response) {
    const data = await variantValueService.seed();
    return res.status(STATUS_OK).json(helper.responseSuccess(data));
  }
}
const variantValueController = new VariantValueController();

export default variantValueController;
