import { Request, Response } from "express";
import { MSG_SUCCESS, STATUS_INTERVAL_ERROR, STATUS_OK } from "../constants";
import commentproductService from "../services/commentproduct.service";

class CommentProductController {
  async getAll(req: Request, res: Response) {
    const { data, error } = await commentproductService.getAll(
      req.query,
      res.locals.user?.id
    );
    if (error) {
      return res.status(STATUS_INTERVAL_ERROR).json({ error });
    }
    return res.status(STATUS_OK).json({ data, message: MSG_SUCCESS });
  }
  async create(req: Request, res: Response) {
    const { data, error } = await commentproductService.create(
      +res.locals.user.id,
      req.body
    );
    if (error) {
      return res.status(STATUS_INTERVAL_ERROR).json({ error });
    }
    return res.status(STATUS_OK).json({ data, message: MSG_SUCCESS });
  }
  async update(req: Request, res: Response) {
    const { data, error } = await commentproductService.update(
      +req.params.id,
      +res.locals.user.id,
      req.body
    );
    if (error) {
      return res.status(STATUS_INTERVAL_ERROR).json({ error });
    }
    return res.status(STATUS_OK).json({ data, message: MSG_SUCCESS });
  }
  async delete(req: Request, res: Response) {
    const { data, error } = await commentproductService.delete(
      +req.params.id,
      +res.locals.user.id
    );
    if (error) {
      return res.status(STATUS_INTERVAL_ERROR).json({ error });
    }
    return res.status(STATUS_OK).json({ message: MSG_SUCCESS });
  }
}

export default new CommentProductController();
