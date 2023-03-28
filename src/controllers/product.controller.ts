import { Request, Response } from "express";
import {
  STATUS_BAD_REQUEST,
  STATUS_CREATED,
  STATUS_INTERVAL_ERROR,
  STATUS_NOTFOUND,
  STATUS_OK,
  STATUS_UNAUTH,
} from "../constantList";
import productService from "../services/product.service";
import helper from "../utils";
import { ProductHasMinMaxPrice } from "../utils/types";

class ProductController {
  async getAll(req: Request, res: Response) {
    const { product_variants, sortBy, sortType } = req.query;
    const data = await productService.getAll(req.query);
    if (product_variants) {
      let items: ProductHasMinMaxPrice[] = [];
      items = data.items.map((item) => ({
        ...item,
        minPrice: productService.price(item, "min"),
        maxPrice: productService.price(item, "max"),
      })) as ProductHasMinMaxPrice[];
      if (sortBy && sortBy === "price")
        items.sort(
          (a: ProductHasMinMaxPrice, b: ProductHasMinMaxPrice) =>
            (a.minPrice - b.minPrice) * (sortType === "ASC" ? 1 : -1)
        );
      return res
        .status(STATUS_OK)
        .json(helper.responseSuccess({ items, count: data.count }));
    }
    return res.status(STATUS_OK).json(helper.responseSuccess(data));
  }
  async search(req: Request, res: Response) {
    const { product_variants, sortBy, sortType } = req.query;
    const data = await productService.search(req.query);
    if (product_variants) {
      let items: ProductHasMinMaxPrice[] = [];
      items = data.items.map((item) => ({
        ...item,
        minPrice: productService.price(item, "min"),
        maxPrice: productService.price(item, "max"),
      })) as ProductHasMinMaxPrice[];
      if (sortBy && sortBy === "price")
        items.sort(
          (a: ProductHasMinMaxPrice, b: ProductHasMinMaxPrice) =>
            (a.minPrice - b.minPrice) * (sortType === "ASC" ? 1 : -1)
        );
      return res
        .status(STATUS_OK)
        .json(helper.responseSuccess({ items, count: data.count }));
    }
    return res.status(STATUS_OK).json(helper.responseSuccess(data));
  }
  async getById(req: Request, res: Response) {
    const data = await productService.getById(+req.params.id);
    if (!data) {
      return res.status(STATUS_NOTFOUND).json(helper.responseError());
    }
    return res.status(STATUS_OK).json(helper.responseSuccess(data));
  }
  async createOne(req: Request, res: Response) {
    try {
      const data = await productService.createOne(req.body);
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
      const data = await productService.updateProduct(+req.params.id, req.body);
      console.log("data", data);
      if (!data) {
        return res.status(STATUS_INTERVAL_ERROR).json(helper.responseError());
      }
      return res.status(STATUS_OK).json(helper.responseSuccess(data));
    } catch (error) {
      return res.status(STATUS_BAD_REQUEST).json(helper.responseError(error));
    }
  }
  async deleteOne(req: Request, res: Response) {
    const result = await productService.deleteOne(+req.params.id);
    if (!result) {
      return res.status(STATUS_UNAUTH).json(helper.responseError());
    }
    return res.status(STATUS_OK).json(helper.responseSuccess());
  }
  async deleteMany(req: Request, res: Response) {
    const result = await productService.deleteMany(
      JSON.parse(req.query.listId + "")
    );
    if (!result) {
      return res.status(STATUS_INTERVAL_ERROR).json(helper.responseError());
    }
    return res.status(STATUS_OK).json(helper.responseSuccess());
  }
  async softDeleteOne(req: Request, res: Response) {
    const result = await productService.softDeleteOne(+req.params.id);
    if (!result) {
      return res.status(STATUS_INTERVAL_ERROR).json(helper.responseError());
    }
    return res.status(STATUS_OK).json(helper.responseSuccess());
  }
  async softDeleteMany(req: Request, res: Response) {
    const result = await productService.softDeleteMany(
      JSON.parse(req.query.listId + "")
    );
    if (!result) {
      return res.status(STATUS_INTERVAL_ERROR).json(helper.responseError());
    }
    return res.status(STATUS_OK).json(helper.responseSuccess());
  }
  async restoreOne(req: Request, res: Response) {
    const result = await productService.restoreOne(+req.params.id);
    if (!result) {
      return res.status(STATUS_INTERVAL_ERROR).json(helper.responseError());
    }
    return res.status(STATUS_OK).json(helper.responseSuccess());
  }
  async restoreMany(req: Request, res: Response) {
    const result = await productService.restoreMany(
      JSON.parse(req.query.listId + "")
    );
    if (!result) {
      return res.status(STATUS_INTERVAL_ERROR).json(helper.responseError());
    }
    return res.status(STATUS_OK).json(helper.responseSuccess());
  }
  //   async seed(req: Request, res: Response) {
  //     const data = await productService.seed();
  //     if (error) {
  //       return res.status(STATUS_INTERVAL_ERROR).json(error);
  //     }
  //     return res.status(STATUS_CREATED).json(helper.responseSuccess(data));
  //   }
  async recommend(req: Request, res: Response) {
    const data = await productService.recommend(req.query);
    return res.status(STATUS_OK).json(helper.responseSuccess(data));
  }
}

const productController = new ProductController();

export default productController;
