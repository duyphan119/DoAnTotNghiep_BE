import { Request, Response } from "express";
import {
  MSG_ERROR,
  MSG_SUCCESS,
  STATUS_CREATED,
  STATUS_INTERVAL_ERROR,
  STATUS_OK,
  STATUS_UNAUTH,
} from "../constantList";
import variantValueService from "../services/variantValue.service";

class VariantValueController {
  async getAll(req: Request, res: Response) {
    const data = await variantValueService.getAll(req.query);
    return res.status(STATUS_OK).json({ data, message: MSG_SUCCESS });
  }
  async getById(req: Request, res: Response) {
    const data = await variantValueService.getById(+req.params.id);
    return res.status(STATUS_OK).json({ data, message: MSG_SUCCESS });
  }
  async createVariantValue(req: Request, res: Response) {
    const data = await variantValueService.createVariantValue(req.body);
    if (!data) {
      return res.status(STATUS_INTERVAL_ERROR).json({ message: MSG_ERROR });
    }
    return res.status(STATUS_CREATED).json({ data, message: MSG_SUCCESS });
  }
  async updateVariantValue(req: Request, res: Response) {
    const data = await variantValueService.updateVariantValue(
      +req.params.id,
      req.body
    );
    if (!data) {
      return res.status(STATUS_INTERVAL_ERROR).json({ message: MSG_ERROR });
    }
    return res.status(STATUS_OK).json({ data, message: MSG_SUCCESS });
  }
  async deleteVariantValue(req: Request, res: Response) {
    const result = await variantValueService.deleteVariantValue(+req.params.id);
    if (!result) {
      return res.status(STATUS_UNAUTH).json({ message: MSG_ERROR });
    }
    return res.status(STATUS_OK).json({ message: MSG_SUCCESS });
  }
  async softDeleteVariantValue(req: Request, res: Response) {
    const result = await variantValueService.softDeleteVariantValue(
      +req.params.id
    );
    if (!result) {
      return res.status(STATUS_UNAUTH).json({ message: MSG_ERROR });
    }
    return res.status(STATUS_OK).json({ message: MSG_SUCCESS });
  }
  async restoreVariantValue(req: Request, res: Response) {
    const result = await variantValueService.restoreVariantValue(
      +req.params.id
    );
    if (!result) {
      return res.status(STATUS_UNAUTH).json({ message: MSG_ERROR });
    }
    return res.status(STATUS_OK).json({ message: MSG_SUCCESS });
  }
  async seed(req: Request, res: Response) {
    const { error, data } = await variantValueService.seed();
    if (error) {
      return res.status(STATUS_INTERVAL_ERROR).json(error);
    }
    return res.status(STATUS_CREATED).json({ data, message: MSG_SUCCESS });
  }
}

const variantValueController = new VariantValueController();

export default variantValueController;
