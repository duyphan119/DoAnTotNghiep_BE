import { Request, Response } from "express";
import {
  MSG_ERROR,
  MSG_SUCCESS,
  STATUS_INTERVAL_ERROR,
  STATUS_OK,
} from "../constantList";
import OrderItem from "../entities/orderItem.entity";
import orderService from "../services/order.service";
import orderItemService from "../services/orderItem.service";

class CartController {
  async loginCreateCart(req: Request, res: Response) {
    const { cart } = req.body;
    const userId = +res.locals.user.id;

    const { id } = cart;
    const { items } = cart;

    const data = await orderService.getAllOrders(
      req.query,
      true,
      false,
      +res.locals.user.id
    );

    let userCart = data.items.length > 0 ? data.items[0] : null;
    if (!userCart) {
      userCart = await orderService.createCart(userId);
    }

    if (userCart) {
      const cartItems = await orderItemService.getRepository().find({
        where: { orderId: userCart.id },
      });

      const updateItems: Array<Promise<any>> = [];
      const createItems: Array<Promise<any>> = [];

      cartItems.forEach((cartItem) => {
        const index = items.findIndex(
          (item: any) => item.productVariantId === cartItem.productVariantId
        );
        if (index !== -1) {
          if (cartItem.quantity !== items[index].quantity) {
            updateItems.push(
              orderItemService.updateOrderItem(
                cartItem.id,
                items[index].quantity
              )
            );
            items.splice(index, 1);
          }
        }
      });

      if (items.length > 0) {
        const id = userCart.id;
        items.forEach((item: any) => {
          createItems.push(
            orderItemService.createOrderItem({
              orderId: id,
              quantity: item.quantity,
              productVariantId: item.productVariantId,
              price: item.price,
            })
          );
        });
      }

      await Promise.all([...createItems, ...updateItems]);
    }

    const data2 = await orderService.getAllOrders(
      req.query,
      true,
      false,
      +res.locals.user.id
    );

    return res.status(STATUS_OK).json({
      data: data2.items.length > 0 ? data2.items[0] : null,
      message: MSG_SUCCESS,
    });
  }
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
          return res
            .status(STATUS_OK)
            .json({ message: MSG_SUCCESS, data: orderItem });
        }
      }
    }

    return res.status(STATUS_INTERVAL_ERROR).json({ message: MSG_ERROR });
  }
  async updateCartItem(req: Request, res: Response) {
    const data = await orderItemService.updateOrderItem(
      +req.params.id,
      req.body.newQuantity
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
