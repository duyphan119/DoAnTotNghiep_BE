import { Request, Response } from "express";
import {
  MSG_ERROR,
  MSG_SUCCESS,
  STATUS_INTERVAL_ERROR,
  STATUS_OK,
} from "../constantList";
import orderService from "../services/order.service";
import orderItemService from "../services/orderItem.service";

class CartController {
  async getCartByUser(req: Request, res: Response) {
    const data = await orderService.getAllOrders(
      req.query,
      true,
      false,
      +res.locals.user.id
    );
    return res.status(STATUS_OK).json({
      data: data.items.length > 0 ? data.items[0] : null,
      message: MSG_SUCCESS,
    });
  }
  async createCartItem(req: Request, res: Response) {
    const { productVariantId, quantity, price } = req.body;
    const userId = +res.locals.user.id;
    const ordersData = await orderService.getAllOrders(
      { items: "true" },
      true,
      false,
      userId
    );
    let cart;
    if (!ordersData || ordersData.count === 0) {
      const newCart = await orderService.createCart(userId);
      cart = newCart;
    }
    if (ordersData.count > 0) cart = ordersData.items[0];
    if (cart) {
      const newCartItem = await orderItemService.createOrderItem({
        // ...(productVariantId ? { productVariantId } : {}),
        // productId,
        orderId: cart.id,
        quantity,
        productVariantId,
        price,
      });
      if (newCartItem) {
        const orderItem = await orderItemService.getById(newCartItem.id, true);
        if (orderItem) {
          return res.status(STATUS_OK).json({ message: MSG_SUCCESS });
        }
      }
    }

    return res.status(STATUS_INTERVAL_ERROR).json({ message: MSG_ERROR });
  }
  async updateCartItem(req: Request, res: Response) {
    const data = await orderItemService.updateOrderItem(
      +req.params.id,
      req.body
    );
    if (!data) {
      return res.status(STATUS_INTERVAL_ERROR).json({ message: MSG_ERROR });
    }
    return res.status(STATUS_OK).json({ data, message: MSG_SUCCESS });
  }
  async deleteCartItem(req: Request, res: Response) {
    const result = await orderItemService.deleteOrderItem(+req.params.id);
    if (!result) {
      return res.status(STATUS_INTERVAL_ERROR).json({ message: MSG_ERROR });
    }
    return res.status(STATUS_OK).json({ message: MSG_SUCCESS });
  }
}

const cartController = new CartController();

export default cartController;
