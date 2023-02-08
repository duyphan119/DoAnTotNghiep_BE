import { Request, Response } from "express";
import {
  MSG_ERROR,
  MSG_SUCCESS,
  STATUS_CREATED,
  STATUS_INTERVAL_ERROR,
  STATUS_OK,
  STATUS_UNAUTH,
} from "../constantList";
import productVariantImageService from "../services/productVariantImage.service";

class ProductVariantImageController {
  async getAll(req: Request, res: Response) {
    const data = await productVariantImageService.getAll(req.query);
    return res.status(STATUS_OK).json({ data, message: MSG_SUCCESS });
  }
  async createProductVariantImages(req: Request, res: Response) {
    const data = await productVariantImageService.createProductVariantImages(
      req.body.inputs
    );
    if (data.length === 0) {
      return res.status(STATUS_INTERVAL_ERROR).json({ message: MSG_ERROR });
    }
    return res.status(STATUS_CREATED).json({ data, message: MSG_SUCCESS });
  }
  async updateProductVariantImage(req: Request, res: Response) {
    const data = await productVariantImageService.updateProductVariantImage(
      +req.params.id,
      req.body.variantValueId
    );

    if (!data) {
      return res.status(STATUS_INTERVAL_ERROR).json({ message: MSG_ERROR });
    }
    return res.status(STATUS_OK).json({ data, message: MSG_SUCCESS });
  }
  async deleteProductVariantImage(req: Request, res: Response) {
    const result = await productVariantImageService.deleteProductVariantImage(
      +req.params.id
    );
    if (!result) {
      return res.status(STATUS_UNAUTH).json({ message: MSG_ERROR });
    }
    return res.status(STATUS_OK).json({ message: MSG_SUCCESS });
  }
}

const productVariantImageController = new ProductVariantImageController();

export default productVariantImageController;
