import { Request, Response } from "express";
import {
  MSG_ERROR,
  MSG_SUCCESS,
  STATUS_CREATED,
  STATUS_INTERVAL_ERROR,
  STATUS_NOTFOUND,
  STATUS_OK,
  STATUS_UNAUTH,
} from "../constantList";
import productService from "../services/product.service";

class ProductController {
  async getAllProducts(req: Request, res: Response) {
    const data = await productService.getAllProducts(
      req.query,
      res.locals.user ? res.locals.user.isAdmin : false
    );
    return res.status(STATUS_OK).json({ data, message: MSG_SUCCESS });
  }
  async getById(req: Request, res: Response) {
    const data = await productService.getById(+req.params.id);
    if (!data) {
      return res.status(STATUS_NOTFOUND).json({ message: MSG_ERROR });
    }
    return res.status(STATUS_OK).json({ data, message: MSG_SUCCESS });
  }
  async createProduct(req: Request, res: Response) {
    const data = await productService.createProduct(req.body);
    if (!data) {
      return res.status(STATUS_INTERVAL_ERROR).json({ message: MSG_ERROR });
    }
    return res.status(STATUS_CREATED).json({ data, message: MSG_SUCCESS });
  }
  async updateProduct(req: Request, res: Response) {
    const data = await productService.updateProduct(+req.params.id, req.body);
    if (!data) {
      return res.status(STATUS_INTERVAL_ERROR).json({ message: MSG_ERROR });
    }
    return res.status(STATUS_OK).json({ data, message: MSG_SUCCESS });
  }
  async deleteProduct(req: Request, res: Response) {
    const result = await productService.deleteProduct(+req.params.id);
    if (!result) {
      return res.status(STATUS_UNAUTH).json({ message: MSG_ERROR });
    }
    return res.status(STATUS_OK).json({ message: MSG_SUCCESS });
  }
  async softDeleteProduct(req: Request, res: Response) {
    const result = await productService.softDeleteProduct(+req.params.id);
    if (!result) {
      return res.status(STATUS_UNAUTH).json({ message: MSG_ERROR });
    }
    return res.status(STATUS_OK).json({ message: MSG_SUCCESS });
  }
  async restoreProduct(req: Request, res: Response) {
    const result = await productService.restoreProduct(+req.params.id);
    if (!result) {
      return res.status(STATUS_UNAUTH).json({ message: MSG_ERROR });
    }
    return res.status(STATUS_OK).json({ message: MSG_SUCCESS });
  }
  async searchProduct(req: Request, res: Response) {
    const data = await productService.searchProduct(req.query);
    return res.status(STATUS_OK).json({ data, message: MSG_SUCCESS });
  }
  //   async seed(req: Request, res: Response) {
  //     const data = await productService.seed();
  //     if (error) {
  //       return res.status(STATUS_INTERVAL_ERROR).json(error);
  //     }
  //     return res.status(STATUS_CREATED).json({ data, message: MSG_SUCCESS });
  //   }
}

const productController = new ProductController();

export default productController;
