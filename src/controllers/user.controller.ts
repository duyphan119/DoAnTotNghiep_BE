import { Request, Response } from "express";
import {
  MSG_ERROR,
  MSG_SUCCESS,
  STATUS_CREATED,
  STATUS_INTERVAL_ERROR,
  STATUS_NOTFOUND,
  STATUS_OK,
} from "../constantList";
import userService from "../services/user.service";

class UserController {
  async getAll(req: Request, res: Response) {
    const data = await userService.getAll(req.query);
    return res.status(STATUS_OK).json({ data, message: MSG_SUCCESS });
  }
  async getById(req: Request, res: Response) {
    const data = await userService.getById(+req.params.userId);
    if (!data) {
      return res.status(STATUS_NOTFOUND).json({ message: MSG_ERROR });
    }
    return res.status(STATUS_OK).json({ data, message: MSG_SUCCESS });
  }
  async createOne(req: Request, res: Response) {
    const data = await userService.createOne(req.body);
    if (!data) {
      return res.status(STATUS_INTERVAL_ERROR).json({ message: MSG_ERROR });
    }
    return res.status(STATUS_CREATED).json({ data, message: MSG_SUCCESS });
  }
  async createMany(req: Request, res: Response) {
    const data = await userService.createMany(req.body.inputs);
    if (!data) {
      return res.status(STATUS_INTERVAL_ERROR).json({ message: MSG_ERROR });
    }
    return res.status(STATUS_CREATED).json({ data, message: MSG_SUCCESS });
  }
  async updateOne(req: Request, res: Response) {
    const data = await userService.updateOne(+req.params.id, req.body);
    if (!data) {
      return res.status(STATUS_INTERVAL_ERROR).json({ message: MSG_ERROR });
    }
    return res.status(STATUS_OK).json({ data, message: MSG_SUCCESS });
  }
  async updateMany(req: Request, res: Response) {
    const data = await userService.updateMany(req.body.inputs);
    if (!data) {
      return res.status(STATUS_INTERVAL_ERROR).json({ message: MSG_ERROR });
    }
    return res.status(STATUS_OK).json({ data, message: MSG_SUCCESS });
  }
  async deleteOne(req: Request, res: Response) {
    const result = await userService.deleteOne(+req.params.id);
    if (!result) {
      return res.status(STATUS_INTERVAL_ERROR).json({ message: MSG_ERROR });
    }
    return res.status(STATUS_OK).json({ message: MSG_SUCCESS });
  }
  async deleteMany(req: Request, res: Response) {
    const result = await userService.deleteMany(
      JSON.parse(req.query.listId + "")
    );
    if (!result) {
      return res.status(STATUS_INTERVAL_ERROR).json({ message: MSG_ERROR });
    }
    return res.status(STATUS_OK).json({ message: MSG_SUCCESS });
  }
  async softDeleteOne(req: Request, res: Response) {
    const result = await userService.softDeleteOne(+req.params.id);
    if (!result) {
      return res.status(STATUS_INTERVAL_ERROR).json({ message: MSG_ERROR });
    }
    return res.status(STATUS_OK).json({ message: MSG_SUCCESS });
  }
  async softDeleteMany(req: Request, res: Response) {
    const result = await userService.softDeleteMany(
      JSON.parse(req.query.listId + "")
    );
    if (!result) {
      return res.status(STATUS_INTERVAL_ERROR).json({ message: MSG_ERROR });
    }
    return res.status(STATUS_OK).json({ message: MSG_SUCCESS });
  }
  async restoreOne(req: Request, res: Response) {
    const result = await userService.restoreOne(+req.params.id);
    if (!result) {
      return res.status(STATUS_INTERVAL_ERROR).json({ message: MSG_ERROR });
    }
    return res.status(STATUS_OK).json({ message: MSG_SUCCESS });
  }
  async restoreMany(req: Request, res: Response) {
    const result = await userService.restoreMany(
      JSON.parse(req.query.listId + "")
    );
    if (!result) {
      return res.status(STATUS_INTERVAL_ERROR).json({ message: MSG_ERROR });
    }
    return res.status(STATUS_OK).json({ message: MSG_SUCCESS });
  }
  async seed(req: Request, res: Response) {
    const data = await userService.seed();
    return res.status(STATUS_OK).json({ data, message: MSG_SUCCESS });
  }
}

const userController = new UserController();

export default userController;
