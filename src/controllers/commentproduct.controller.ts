import { Request, Response } from "express";
import {
  MSG_ERROR,
  MSG_SUCCESS,
  STATUS_BAD_REQUEST,
  STATUS_INTERVAL_ERROR,
  STATUS_NOTFOUND,
  STATUS_OK,
} from "../constantList";
import commentProductService from "../services/commentProduct.service";
import productService from "../services/product.service";
import helper from "../utils";
import productController from "./product.controller";

class CommentProductController {
  async getAll(req: Request, res: Response) {
    const data = await commentProductService.getAll(req.query);
    const { productId } = req.query;
    if (productId && res.locals.user) {
      const userId = +res.locals.user.id;
      const userCommentProduct =
        await commentProductService.checkUserCommentProduct(userId, +productId);
      return res
        .status(STATUS_OK)
        .json(helper.responseSuccess({ ...data, userCommentProduct }));
    }
    return res.status(STATUS_OK).json(helper.responseSuccess(data));
  }
  async getById(req: Request, res: Response) {
    const data = await commentProductService.getById(+req.params.id);
    if (data && res.locals.user) {
      const { id: userId, isAdmin } = res.locals.user;

      if (data.userId === userId || isAdmin) {
        return res.status(STATUS_OK).json(helper.responseSuccess(data));
      }
    }
    return res.status(STATUS_NOTFOUND).json(helper.responseError());
  }
  async createOne(req: Request, res: Response) {
    try {
      const userId = +res.locals.user.id;
      const data = await commentProductService.createOne({
        ...req.body,
        userId,
      });
      if (!data) {
        return res.status(STATUS_INTERVAL_ERROR).json(helper.responseError());
      }
      await productService.updateStar(data.productId);

      return res
        .status(STATUS_OK)
        .json(
          helper.responseSuccess(await commentProductService.getById(data.id))
        );
    } catch (error) {
      return res.status(STATUS_BAD_REQUEST).json(helper.responseError(error));
    }
  }
  async updateOne(req: Request, res: Response) {
    try {
      const id = +req.params.id;
      const userId = +res.locals.user.id;
      const userCommentProduct = await commentProductService.getById(id);
      if (userCommentProduct && userCommentProduct.userId === userId) {
        const data = await commentProductService.updateOne(id, {
          ...req.body,
          userId,
        });
        if (data) {
          return res
            .status(STATUS_OK)
            .json(
              helper.responseSuccess(
                await commentProductService.getById(data.id)
              )
            );
        }
      }
      return res.status(STATUS_INTERVAL_ERROR).json(helper.responseError());
    } catch (error) {
      return res.status(STATUS_BAD_REQUEST).json(helper.responseError(error));
    }
  }
  async deleteOne(req: Request, res: Response) {
    const userId = +res.locals.user.id;
    const id = +req.params.id;
    const userCommentProduct = await commentProductService.getById(id);
    if (userCommentProduct && userCommentProduct.userId === userId) {
      const result = await commentProductService.deleteOne(id);
      if (result) {
        return res.status(STATUS_OK).json(helper.responseSuccess());
      }
    }
    return res.status(STATUS_INTERVAL_ERROR).json(helper.responseError());
  }
}
const commentProductController = new CommentProductController();
export default commentProductController;
