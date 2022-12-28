import { Request, Response } from "express";
import {
  MSG_SUCCESS,
  STATUS_CREATED,
  STATUS_INTERVAL_ERROR,
  STATUS_OK,
  STATUS_UNAUTH,
} from "../constants";
import productVariantService from "../services/productvariant.service";

class ProductVariantController {
  async getAllProductVariants(req: Request, res: Response) {
    const { error, data } = await productVariantService.getAllProductVariants(
      req.query,
      res.locals.user ? res.locals.user.isAdmin : false
    );
    if (error) {
      return res.status(STATUS_INTERVAL_ERROR).json(error);
    }
    return res.status(STATUS_OK).json({ data, message: MSG_SUCCESS });
  }
  async getById(req: Request, res: Response) {
    const { error, data } = await productVariantService.getById(+req.params.id);
    if (error) {
      return res.status(STATUS_INTERVAL_ERROR).json(error);
    }
    return res.status(STATUS_OK).json({ data, message: MSG_SUCCESS });
  }
  async createProductVariant(req: Request, res: Response) {
    const { error, data } = await productVariantService.createProductVariant(
      req.body
    );
    if (error) {
      return res.status(STATUS_INTERVAL_ERROR).json(error);
    }
    return res.status(STATUS_CREATED).json({ data, message: MSG_SUCCESS });
  }
  async createProductVariants(req: Request, res: Response) {
    const { error, data } = await productVariantService.createProductVariants(
      req.body
    );
    if (error) {
      return res.status(STATUS_INTERVAL_ERROR).json(error);
    }
    return res.status(STATUS_CREATED).json({ data, message: MSG_SUCCESS });
  }
  async updateProductVariant(req: Request, res: Response) {
    const { error, data } = await productVariantService.updateProductVariant(
      +req.params.id,
      req.body
    );
    if (error) {
      return res.status(STATUS_INTERVAL_ERROR).json(error);
    }
    return res.status(STATUS_OK).json({ data, message: MSG_SUCCESS });
  }
  async deleteProductVariant(req: Request, res: Response) {
    const { error } = await productVariantService.deleteProductVariant(
      +req.params.id
    );
    if (error) {
      return res.status(STATUS_UNAUTH).json(error);
    }
    return res.status(STATUS_OK).json({ message: MSG_SUCCESS });
  }
  async softDeleteProductVariant(req: Request, res: Response) {
    const { error } = await productVariantService.softDeleteProductVariant(
      +req.params.id
    );
    if (error) {
      return res.status(STATUS_UNAUTH).json(error);
    }
    return res.status(STATUS_OK).json({ message: MSG_SUCCESS });
  }
  async restoreProductVariant(req: Request, res: Response) {
    const { error } = await productVariantService.restoreProductVariant(
      +req.params.id
    );
    if (error) {
      return res.status(STATUS_UNAUTH).json(error);
    }
    return res.status(STATUS_OK).json({ message: MSG_SUCCESS });
  }
  // async seed(req: Request, res: Response) {
  //   const { error, data } = await productVariantService.seed();
  //   if (error) {
  //     return res.status(STATUS_INTERVAL_ERROR).json(error);
  //   }
  //   return res.status(STATUS_CREATED).json({ data, message: MSG_SUCCESS });
  // }
}

export default new ProductVariantController();
