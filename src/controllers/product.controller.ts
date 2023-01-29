import { Request, Response } from "express";
import {
  MSG_SUCCESS,
  STATUS_CREATED,
  STATUS_INTERVAL_ERROR,
  STATUS_OK,
  STATUS_UNAUTH,
} from "../constantList";
import productService from "../services/product.service";

class ProductController {
  async getAllProducts(req: Request, res: Response) {
    const { error, data } = await productService.getAllProducts(
      req.query,
      res.locals.user ? res.locals.user.isAdmin : false
    );
    if (data) {
      return res.status(STATUS_OK).json({ data, message: MSG_SUCCESS });
    }
    return res.status(STATUS_INTERVAL_ERROR).json(error);
  }
  async getById(req: Request, res: Response) {
    const { error, data } = await productService.getById(+req.params.id);
    if (data) {
      return res.status(STATUS_OK).json({ data, message: MSG_SUCCESS });
    }
    return res.status(STATUS_INTERVAL_ERROR).json(error);
  }
  async createProduct(req: Request, res: Response) {
    const { error, data } = await productService.createProduct(req.body);
    if (data) {
      return res.status(STATUS_CREATED).json({ data, message: MSG_SUCCESS });
    }
    return res.status(STATUS_INTERVAL_ERROR).json(error);
  }
  async updateProduct(req: Request, res: Response) {
    const { error, data } = await productService.updateProduct(
      +req.params.id,
      req.body
    );
    if (data) {
      return res.status(STATUS_OK).json({ data, message: MSG_SUCCESS });
    }
    return res.status(STATUS_INTERVAL_ERROR).json(error);
  }
  async deleteProduct(req: Request, res: Response) {
    const { error } = await productService.deleteProduct(+req.params.id);
    if (error) {
      return res.status(STATUS_UNAUTH).json(error);
    }
    return res.status(STATUS_OK).json({ message: MSG_SUCCESS });
  }
  async softDeleteProduct(req: Request, res: Response) {
    const { error } = await productService.softDeleteProduct(+req.params.id);
    if (error) {
      return res.status(STATUS_UNAUTH).json(error);
    }
    return res.status(STATUS_OK).json({ message: MSG_SUCCESS });
  }
  async restoreProduct(req: Request, res: Response) {
    const { error } = await productService.restoreProduct(+req.params.id);
    if (error) {
      return res.status(STATUS_UNAUTH).json(error);
    }
    return res.status(STATUS_OK).json({ message: MSG_SUCCESS });
  }
  //   async seed(req: Request, res: Response) {
  //     const { error, data } = await productService.seed();
  //     if (error) {
  //       return res.status(STATUS_INTERVAL_ERROR).json(error);
  //     }
  //     return res.status(STATUS_CREATED).json({ data, message: MSG_SUCCESS });
  //   }
}

export default new ProductController();
