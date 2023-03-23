import { Request, Response } from "express";
import {
  MSG_ERROR,
  MSG_SUCCESS,
  STATUS_CREATED,
  STATUS_INTERVAL_ERROR,
  STATUS_NOTFOUND,
  STATUS_OK,
} from "../constantList";
import productVariantService from "../services/productVariant.service";

class ProductVariantController {
  async getAll(req: Request, res: Response) {
    const data = await productVariantService.getAll(req.query);
    return res.status(STATUS_OK).json({ data, message: MSG_SUCCESS });
  }
  async getById(req: Request, res: Response) {
    const data = await productVariantService.getById(+req.params.id);
    if (!data) {
      return res.status(STATUS_NOTFOUND).json({ message: MSG_ERROR });
    }
    return res.status(STATUS_OK).json({ data, message: MSG_SUCCESS });
  }
  async createOne(req: Request, res: Response) {
    const data = await productVariantService.createOne(req.body);
    if (!data) {
      return res.status(STATUS_INTERVAL_ERROR).json({ message: MSG_ERROR });
    }
    return res.status(STATUS_CREATED).json({ data, message: MSG_SUCCESS });
  }
  async createMany(req: Request, res: Response) {
    const data = await productVariantService.createMany(req.body.inputs);
    if (!data) {
      return res.status(STATUS_INTERVAL_ERROR).json({ message: MSG_ERROR });
    }
    return res.status(STATUS_CREATED).json({ data, message: MSG_SUCCESS });
  }
  async updateOne(req: Request, res: Response) {
    const data = await productVariantService.updateOne(
      +req.params.id,
      req.body
    );
    if (!data) {
      return res.status(STATUS_INTERVAL_ERROR).json({ message: MSG_ERROR });
    }
    return res.status(STATUS_OK).json({ data, message: MSG_SUCCESS });
  }
  async updateMany(req: Request, res: Response) {
    const data = await productVariantService.updateMany(req.body.inputs);
    if (!data) {
      return res.status(STATUS_INTERVAL_ERROR).json({ message: MSG_ERROR });
    }
    return res.status(STATUS_OK).json({ data, message: MSG_SUCCESS });
  }
  async deleteOne(req: Request, res: Response) {
    const result = await productVariantService.deleteOne(+req.params.id);
    if (!result) {
      return res.status(STATUS_INTERVAL_ERROR).json({ message: MSG_ERROR });
    }
    return res.status(STATUS_OK).json({ message: MSG_SUCCESS });
  }
  async deleteMany(req: Request, res: Response) {
    const result = await productVariantService.deleteMany(
      JSON.parse(req.query.listId + "")
    );
    if (!result) {
      return res.status(STATUS_INTERVAL_ERROR).json({ message: MSG_ERROR });
    }
    return res.status(STATUS_OK).json({ message: MSG_SUCCESS });
  }
  async softDeleteOne(req: Request, res: Response) {
    const result = await productVariantService.softDeleteOne(+req.params.id);
    if (!result) {
      return res.status(STATUS_INTERVAL_ERROR).json({ message: MSG_ERROR });
    }
    return res.status(STATUS_OK).json({ message: MSG_SUCCESS });
  }
  async softDeleteMany(req: Request, res: Response) {
    const result = await productVariantService.softDeleteMany(
      JSON.parse(req.query.listId + "")
    );
    if (!result) {
      return res.status(STATUS_INTERVAL_ERROR).json({ message: MSG_ERROR });
    }
    return res.status(STATUS_OK).json({ message: MSG_SUCCESS });
  }
  async restoreOne(req: Request, res: Response) {
    const result = await productVariantService.restoreOne(+req.params.id);
    if (!result) {
      return res.status(STATUS_INTERVAL_ERROR).json({ message: MSG_ERROR });
    }
    return res.status(STATUS_OK).json({ message: MSG_SUCCESS });
  }
  async restoreMany(req: Request, res: Response) {
    const result = await productVariantService.restoreMany(
      JSON.parse(req.query.listId + "")
    );
    if (!result) {
      return res.status(STATUS_INTERVAL_ERROR).json({ message: MSG_ERROR });
    }
    return res.status(STATUS_OK).json({ message: MSG_SUCCESS });
  }
}

const productVariantController = new ProductVariantController();

export default productVariantController;
