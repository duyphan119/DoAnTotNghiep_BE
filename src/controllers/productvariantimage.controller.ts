import { Request, Response } from "express";
import {
  STATUS_BAD_REQUEST,
  STATUS_CREATED,
  STATUS_INTERVAL_ERROR,
  STATUS_OK,
  STATUS_UNAUTH,
} from "../constantList";
import productVariantImageService from "../services/productVariantImage.service";
import helper from "../utils";

class ProductVariantImageController {
  async getAll(req: Request, res: Response) {
    const data = await productVariantImageService.getAll(req.query);
    return res.status(STATUS_OK).json(helper.responseSuccess(data));
  }
  async createMany(req: Request, res: Response) {
    try {
      const data = await productVariantImageService.createMany(req.body.inputs);
      if (data.length === 0) {
        return res.status(STATUS_INTERVAL_ERROR).json(helper.responseError());
      }
      return res.status(STATUS_CREATED).json(helper.responseSuccess(data));
    } catch (error) {
      return res.status(STATUS_BAD_REQUEST).json(helper.responseError(error));
    }
  }
  async updateOne(req: Request, res: Response) {
    try {
      const data = await productVariantImageService.updateOne(
        +req.params.id,
        req.body.variantValueId
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
    const result = await productVariantImageService.deleteOne(+req.params.id);
    if (!result) {
      return res.status(STATUS_UNAUTH).json(helper.responseError());
    }
    return res.status(STATUS_OK).json(helper.responseSuccess());
  }
  async deleteMany(req: Request, res: Response) {
    const result = await productVariantImageService.deleteMany(
      JSON.parse(req.query.listId + "")
    );
    if (!result) {
      return res.status(STATUS_UNAUTH).json(helper.responseError());
    }
    return res.status(STATUS_OK).json(helper.responseSuccess());
  }
}

const productVariantImageController = new ProductVariantImageController();

export default productVariantImageController;
