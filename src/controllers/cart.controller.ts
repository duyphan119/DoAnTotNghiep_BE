import { Request, Response } from "express";
import { MSG_SUCCESS, STATUS_INTERVAL_ERROR, STATUS_OK } from "../constants";
import orderService from "../services/order.service";
import orderItemService from "../services/orderitem.service";

class CartController {
  async getCartByUser(req: Request, res: Response) {
    const { data, error } = await orderService.getAllOrders(
      req.query,
      true,
      false,
      +res.locals.user.id
    );
    if (data) {
      return res.status(STATUS_OK).json({ data, message: MSG_SUCCESS });
    }
    return res.status(STATUS_INTERVAL_ERROR).json(error);
  }
  async createCartItem(req: Request, res: Response) {
    const { productVariantId, productId, quantity } = req.body;
    const userId = +res.locals.user.id;
    const { data: ordersData, error } = await orderService.getAllOrders(
      {},
      true,
      false,
      userId
    );
    let cart;
    if (!ordersData || ordersData.count === 0) {
      const { data: newCart } = await orderService.createCart(userId);
      cart = newCart;
    }
    if (cart) {
      const { data: newCartItem } = await orderItemService.createOrderItem({
        ...(productVariantId ? { productVariantId } : {}),
        productId,
        orderId: cart.id,
        quantity,
      });
      const { data, error } = await orderItemService.getById(
        newCartItem.id,
        true
      );
      if (data) {
        return res.status(STATUS_OK).json({ data, message: MSG_SUCCESS });
      }
      return res.status(STATUS_INTERVAL_ERROR).json(error);
    }

    return res.status(STATUS_INTERVAL_ERROR).json(error);
  }
  async updateCartItem(req: Request, res: Response) {
    const { data, error } = await orderItemService.updateOrderItem(
      +req.params.id,
      req.body
    );
    if (data) {
      return res.status(STATUS_OK).json({ data, message: MSG_SUCCESS });
    }
    return res.status(STATUS_INTERVAL_ERROR).json(error);
  }
  async deleteCartItem(req: Request, res: Response) {
    const { error } = await orderItemService.deleteOrderItem(+req.params.id);
    if (error) {
      return res.status(STATUS_INTERVAL_ERROR).json(error);
    }
    return res.status(STATUS_OK).json({ message: MSG_SUCCESS });
  }
}

export default new CartController();
