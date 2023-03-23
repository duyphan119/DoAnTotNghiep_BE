import { Request, Response } from "express";
import {
  MSG_ERROR,
  MSG_SUCCESS,
  STATUS_INTERVAL_ERROR,
  STATUS_NOTFOUND,
  STATUS_OK,
} from "../constantList";
import notificationService from "../services/notification.service";
import notifyService from "../services/notification.service";
import orderService from "../services/order.service";

class OrderController {
  async getAllOrders(req: Request, res: Response) {
    const data = await orderService.getAllOrders(req.query, false, true);
    return res.status(STATUS_OK).json({ data, message: MSG_SUCCESS });
  }
  async getOrdersUser(req: Request, res: Response) {
    const data = await orderService.getAllOrders(
      req.query,
      false,
      false,
      +res.locals.user.id
    );
    return res.status(STATUS_OK).json({ data, message: MSG_SUCCESS });
  }
  async getOrderById(req: Request, res: Response) {
    const data = await orderService.getOrderById(+req.params.id);
    if (!data) {
      return res.status(STATUS_NOTFOUND).json({ message: MSG_ERROR });
    }
    return res.status(STATUS_OK).json({ data, message: MSG_SUCCESS });
  }

  async updateStatus(req: Request, res: Response) {
    const data = await orderService.updateStatus(+req.params.id);
    if (!data) {
      return res.status(STATUS_INTERVAL_ERROR).json({ message: MSG_ERROR });
    }
    return res.status(STATUS_OK).json({ data, message: MSG_SUCCESS });
  }
  async checkout(req: Request, res: Response) {
    const userId = +res.locals.user.id;
    const data = await orderService.checkout(userId, req.body);

    if (!data) {
      return res.status(STATUS_INTERVAL_ERROR).json({ message: MSG_ERROR });
    }

    const notification = await notificationService.createOrderNotification(
      data.userId
    );

    if (notification) {
      _io.emit("Has notify", notification);
    }

    return res.status(STATUS_OK).json({ data, message: MSG_SUCCESS });
  }
}

const orderController = new OrderController();

export default orderController;
