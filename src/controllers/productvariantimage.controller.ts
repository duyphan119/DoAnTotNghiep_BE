import { Request, Response } from "express";
import {
  MSG_SUCCESS,
  STATUS_CREATED,
  STATUS_INTERVAL_ERROR,
  STATUS_OK,
  STATUS_UNAUTH,
} from "../constantList";
import productVariantImageService from "../services/productvariantimage.service";

class ProductVariantImageController {
  async getAll(req: Request, res: Response) {
    const { error, data } = await productVariantImageService.getAll(req.query);
    if (error) {
      return res.status(STATUS_INTERVAL_ERROR).json(error);
    }
    return res.status(STATUS_OK).json({ data, message: MSG_SUCCESS });
  }
  async createProductVariantImages(req: Request, res: Response) {
    const { error, data } =
      await productVariantImageService.createProductVariantImages(
        req.body.inputs
      );
    if (error) {
      return res.status(STATUS_INTERVAL_ERROR).json(error);
    }
    return res.status(STATUS_CREATED).json({ data, message: MSG_SUCCESS });
  }
  async updateProductVariantImage(req: Request, res: Response) {
    const { error, data } =
      await productVariantImageService.updateProductVariantImage(
        +req.params.id,
        req.body.variantValueId
      );
    if (error) {
      return res.status(STATUS_INTERVAL_ERROR).json(error);
    }
    return res.status(STATUS_OK).json({ data, message: MSG_SUCCESS });
  }
  async deleteProductVariantImage(req: Request, res: Response) {
    const { error } =
      await productVariantImageService.deleteProductVariantImage(
        +req.params.id
      );
    if (error) {
      return res.status(STATUS_UNAUTH).json(error);
    }
    return res.status(STATUS_OK).json({ message: MSG_SUCCESS });
  }
}

export default new ProductVariantImageController();
