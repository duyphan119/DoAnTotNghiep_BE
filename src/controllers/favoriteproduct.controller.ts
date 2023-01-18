import { Request, Response } from "express";
import {
  MSG_SUCCESS,
  STATUS_CREATED,
  STATUS_INTERVAL_ERROR,
  STATUS_OK,
  STATUS_UNAUTH,
} from "../constants";
import favoriteproductService from "../services/favoriteproduct.service";

class FavoriteProductController {
  async getByUser(req: Request, res: Response) {
    const { error, data } = await favoriteproductService.getByUser(
      +res.locals.user.id,
      req.query
    );
    if (error) {
      return res.status(STATUS_INTERVAL_ERROR).json(error);
    }
    return res.status(STATUS_OK).json({ data, message: MSG_SUCCESS });
  }
  async createFavoriteProduct(req: Request, res: Response) {
    const { error, data } = await favoriteproductService.createFavoriteProduct(
      +res.locals.user.id,
      req.body.productId
    );
    if (data) {
      return res.status(STATUS_CREATED).json({ data, message: MSG_SUCCESS });
    }
    return res.status(STATUS_INTERVAL_ERROR).json(error);
  }
  async deleteFavoriteProduct(req: Request, res: Response) {
    const { error } = await favoriteproductService.deleteFavoriteProduct(
      +res.locals.user.id,
      +req.params.id
    );
    if (error) {
      return res.status(STATUS_UNAUTH).json(error);
    }
    return res.status(STATUS_OK).json({ message: MSG_SUCCESS });
  }
}

export default new FavoriteProductController();
