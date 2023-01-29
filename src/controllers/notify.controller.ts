import { Request, Response } from "express";
import {
  MSG_ERROR,
  MSG_SUCCESS,
  STATUS_CREATED,
  STATUS_OK,
} from "../constantList";
import notifyService from "../services/notify.service";

class NotifyController {
  async getAll(req: Request, res: Response) {
    const { data, error } = await notifyService.getAll(req.query);

    if (data) return res.status(STATUS_OK).json({ message: MSG_SUCCESS, data });

    return res.status(STATUS_OK).json({ message: MSG_ERROR, data: error });
  }

  async createOne(req: Request, res: Response) {
    const user = res.locals.user;
    if (!user) return res.status(STATUS_OK).json({ message: MSG_ERROR });
    const { data, error } = await notifyService.createOne(+user.id, req.body);

    if (data)
      return res.status(STATUS_CREATED).json({ message: MSG_SUCCESS, data });

    return res.status(STATUS_OK).json({ message: MSG_ERROR, data: error });
  }

  async deleteOne(req: Request, res: Response) {
    const id = +req.params.id;
    const { error } = await notifyService.deleteOne(id);

    if (error) return res.status(STATUS_OK).json({ message: MSG_ERROR });
    return res.status(STATUS_OK).json({ message: MSG_SUCCESS });
  }
}

export default new NotifyController();
