import { Request, Response } from "express";
import {
  MSG_ERROR,
  MSG_SUCCESS,
  STATUS_INTERVAL_ERROR,
  STATUS_NOTFOUND,
  STATUS_OK,
} from "../constantList";
import commentproductService from "../services/commentProduct.service";

class CommentProductController {
  async getAll(req: Request, res: Response) {
    const data = await commentproductService.getAll(
      req.query,
      res.locals.user?.id
    );
    return res.status(STATUS_OK).json({ data, message: MSG_SUCCESS });
  }
  async getById(req: Request, res: Response) {
    const data = await commentproductService.getById(+req.params.id);
    if (data && res.locals.user) {
      const { id: userId, isAdmin } = res.locals.user;

      if (data.userId === userId || isAdmin) {
        return res.status(STATUS_OK).json({ data, message: MSG_SUCCESS });
      }
    }
    return res.status(STATUS_NOTFOUND).json({ message: MSG_ERROR });
  }
  async create(req: Request, res: Response) {
    const data = await commentproductService.create(
      +res.locals.user.id,
      req.body
    );
    if (!data) {
      return res.status(STATUS_INTERVAL_ERROR).json({ message: MSG_ERROR });
    }
    return res.status(STATUS_OK).json({ data, message: MSG_SUCCESS });
  }
  async update(req: Request, res: Response) {
    const data = await commentproductService.update(
      +req.params.id,
      +res.locals.user.id,
      req.body
    );
    if (!data) {
      return res.status(STATUS_INTERVAL_ERROR).json({ message: MSG_ERROR });
    }
    return res.status(STATUS_OK).json({ data, message: MSG_SUCCESS });
  }
  async delete(req: Request, res: Response) {
    const result = await commentproductService.delete(
      +req.params.id,
      +res.locals.user.id
    );
    if (!result) {
      return res.status(STATUS_INTERVAL_ERROR).json({ message: MSG_ERROR });
    }
    return res.status(STATUS_OK).json({ message: MSG_SUCCESS });
  }
}
const commentProductController = new CommentProductController();
export default commentProductController;
