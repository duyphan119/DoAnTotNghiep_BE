import { Request, Response } from "express";
import {
  MSG_ERROR,
  MSG_SUCCESS,
  STATUS_INTERVAL_ERROR,
  STATUS_OK,
} from "../constantList";
import { NotifyTypeEnum } from "../entities/notify.entity";
import notifyService from "../services/notify.service";
import orderService from "../services/order.service";

class OrderController {
  async getAllOrders(req: Request, res: Response) {
    const { data, error } = await orderService.getAllOrders(
      req.query,
      false,
      true
    );
    if (data) {
      return res.status(STATUS_OK).json({ data, message: MSG_SUCCESS });
    }
    return res.status(STATUS_INTERVAL_ERROR).json(error);
  }
  async getOrdersUser(req: Request, res: Response) {
    const { data, error } = await orderService.getAllOrders(
      req.query,
      false,
      false,
      +res.locals.user.id
    );
    if (data) {
      return res.status(STATUS_OK).json({ data, message: MSG_SUCCESS });
    }
    return res.status(STATUS_OK).json({ error, message: MSG_ERROR });
  }
  async getOrderById(req: Request, res: Response) {
    const { data, error } = await orderService.getOrderById(+req.params.id);
    if (data) {
      return res.status(STATUS_OK).json({ data, message: MSG_SUCCESS });
    }
    return res.status(STATUS_INTERVAL_ERROR).json(error);
  }

  async updateStatus(req: Request, res: Response) {
    const { data, error } = await orderService.updateStatus(+req.params.id);
    if (data) {
      return res.status(STATUS_OK).json({ data, message: MSG_SUCCESS });
    }
    return res.status(STATUS_INTERVAL_ERROR).json(error);
  }
  async checkout(req: Request, res: Response) {
    const userId = +res.locals.user.id;
    const { data, error } = await orderService.checkout(userId, req.body);

    if (data) {
      const { data: data2 } = await notifyService.createOne(userId, {
        message: "Bạn có đơn hàng mới",
        type: NotifyTypeEnum.Order,
      });

      if (data2) {
        _io.emit("Has notify", data2);
      }

      return res.status(STATUS_OK).json({ data, message: MSG_SUCCESS });
    }

    return res.status(STATUS_INTERVAL_ERROR).json(error);
  }
}

export default new OrderController();
