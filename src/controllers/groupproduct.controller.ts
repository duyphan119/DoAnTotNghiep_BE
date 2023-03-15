import { Request, Response } from "express";
import {
  MSG_ERROR,
  MSG_SUCCESS,
  STATUS_CREATED,
  STATUS_INTERVAL_ERROR,
  STATUS_NOTFOUND,
  STATUS_OK,
} from "../constantList";
import groupProductService from "../services/groupProduct.service";

class GroupProductController {
  async getAll(req: Request, res: Response) {
    const data = await groupProductService.getAll(req.query);
    return res.status(STATUS_OK).json({ data, message: MSG_SUCCESS });
  }
  async getById(req: Request, res: Response) {
    const data = await groupProductService.getById(+req.params.id);
    if (!data) {
      return res.status(STATUS_NOTFOUND).json({ message: MSG_ERROR });
    }
    return res.status(STATUS_OK).json({ data, message: MSG_SUCCESS });
  }
  async createOne(req: Request, res: Response) {
    const data = await groupProductService.createOne(req.body);
    if (!data) {
      return res.status(STATUS_INTERVAL_ERROR).json({ message: MSG_ERROR });
    }
    return res.status(STATUS_CREATED).json({ data, message: MSG_SUCCESS });
  }
  async createMany(req: Request, res: Response) {
    const data = await groupProductService.createMany(req.body.inputs);
    if (!data) {
      return res.status(STATUS_INTERVAL_ERROR).json({ message: MSG_ERROR });
    }
    return res.status(STATUS_CREATED).json({ data, message: MSG_SUCCESS });
  }
  async updateOne(req: Request, res: Response) {
    const data = await groupProductService.updateOne(+req.params.id, req.body);
    if (!data) {
      return res.status(STATUS_INTERVAL_ERROR).json({ message: MSG_ERROR });
    }
    return res.status(STATUS_OK).json({ data, message: MSG_SUCCESS });
  }
  async updateMany(req: Request, res: Response) {
    const data = await groupProductService.updateMany(req.body.inputs);
    if (!data) {
      return res.status(STATUS_INTERVAL_ERROR).json({ message: MSG_ERROR });
    }
    return res.status(STATUS_OK).json({ data, message: MSG_SUCCESS });
  }
  async deleteOne(req: Request, res: Response) {
    const result = await groupProductService.deleteOne(+req.params.id);
    if (!result) {
      return res.status(STATUS_INTERVAL_ERROR).json({ message: MSG_ERROR });
    }
    return res.status(STATUS_OK).json({ message: MSG_SUCCESS });
  }
  async deleteMany(req: Request, res: Response) {
    const result = await groupProductService.deleteMany(
      JSON.parse(req.query.listId + "")
    );
    if (!result) {
      return res.status(STATUS_INTERVAL_ERROR).json({ message: MSG_ERROR });
    }
    return res.status(STATUS_OK).json({ message: MSG_SUCCESS });
  }
  async softDeleteOne(req: Request, res: Response) {
    const result = await groupProductService.softDeleteOne(+req.params.id);
    if (!result) {
      return res.status(STATUS_INTERVAL_ERROR).json({ message: MSG_ERROR });
    }
    return res.status(STATUS_OK).json({ message: MSG_SUCCESS });
  }
  async softDeleteMany(req: Request, res: Response) {
    const result = await groupProductService.softDeleteMany(
      JSON.parse(req.query.listId + "")
    );
    if (!result) {
      return res.status(STATUS_INTERVAL_ERROR).json({ message: MSG_ERROR });
    }
    return res.status(STATUS_OK).json({ message: MSG_SUCCESS });
  }
  async restoreOne(req: Request, res: Response) {
    const result = await groupProductService.restoreOne(+req.params.id);
    if (!result) {
      return res.status(STATUS_INTERVAL_ERROR).json({ message: MSG_ERROR });
    }
    return res.status(STATUS_OK).json({ message: MSG_SUCCESS });
  }
  async restoreMany(req: Request, res: Response) {
    const result = await groupProductService.restoreMany(
      JSON.parse(req.query.listId + "")
    );
    if (!result) {
      return res.status(STATUS_INTERVAL_ERROR).json({ message: MSG_ERROR });
    }
    return res.status(STATUS_OK).json({ message: MSG_SUCCESS });
  }
  async seed(req: Request, res: Response) {
    const data = await groupProductService.seed();
    return res.status(STATUS_CREATED).json({ data, message: MSG_SUCCESS });
  }
}

const groupProductController = new GroupProductController();

export default groupProductController;
