import { Request, Response } from "express";
import {
  MSG_SUCCESS,
  STATUS_CREATED,
  STATUS_INTERVAL_ERROR,
  STATUS_OK,
  STATUS_UNAUTH,
} from "../constantList";
import groupproductService from "../services/groupproduct.service";

class GroupProductController {
  async getAll(req: Request, res: Response) {
    const { isAdmin } = res.locals.user;
    const { error, data } = await groupproductService.getAll(
      req.query,
      isAdmin
    );
    if (error) {
      return res.status(STATUS_INTERVAL_ERROR).json(error);
    }
    _io.emit("test", data);
    return res.status(STATUS_OK).json({ data, message: MSG_SUCCESS });
  }
  async getById(req: Request, res: Response) {
    const { error, data } = await groupproductService.getById(+req.params.id);
    if (error) {
      return res.status(STATUS_INTERVAL_ERROR).json(error);
    }
    return res.status(STATUS_OK).json({ data, message: MSG_SUCCESS });
  }
  async createGroupProduct(req: Request, res: Response) {
    const { error, data } = await groupproductService.createGroupProduct(
      req.body
    );
    if (error) {
      return res.status(STATUS_INTERVAL_ERROR).json(error);
    }
    return res.status(STATUS_CREATED).json({ data, message: MSG_SUCCESS });
  }
  async updateGroupProduct(req: Request, res: Response) {
    const { error, data } = await groupproductService.updateGroupProduct(
      +req.params.id,
      req.body
    );
    if (error) {
      return res.status(STATUS_INTERVAL_ERROR).json(error);
    }
    return res.status(STATUS_OK).json({ data, message: MSG_SUCCESS });
  }
  async deleteGroupProduct(req: Request, res: Response) {
    const { error } = await groupproductService.deleteGroupProduct(
      +req.params.id
    );
    if (error) {
      return res.status(STATUS_UNAUTH).json(error);
    }
    return res.status(STATUS_OK).json({ message: MSG_SUCCESS });
  }
  async softDeleteGroupProduct(req: Request, res: Response) {
    const { error } = await groupproductService.softDeleteGroupProduct(
      +req.params.id
    );
    if (error) {
      return res.status(STATUS_UNAUTH).json(error);
    }
    return res.status(STATUS_OK).json({ message: MSG_SUCCESS });
  }
  async restoreGroupProduct(req: Request, res: Response) {
    const { error } = await groupproductService.restoreGroupProduct(
      +req.params.id
    );
    if (error) {
      return res.status(STATUS_UNAUTH).json(error);
    }
    return res.status(STATUS_OK).json({ message: MSG_SUCCESS });
  }
  async seed(req: Request, res: Response) {
    const { error, data } = await groupproductService.seed();
    if (error) {
      return res.status(STATUS_INTERVAL_ERROR).json(error);
    }
    return res.status(STATUS_CREATED).json({ data, message: MSG_SUCCESS });
  }
}

export default new GroupProductController();
