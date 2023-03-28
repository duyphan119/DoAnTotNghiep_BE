import { Request, Response } from "express";
import {
  MSG_ERROR,
  MSG_SUCCESS,
  STATUS_INTERVAL_ERROR,
  STATUS_OK,
} from "../constantList";
import orderService from "../services/order.service";
import orderItemService from "../services/orderItem.service";
import helper from "../utils";

class CartController {
  async loginCreateCart(req: Request, res: Response) {
    const { cart } = req.body;
    const userId = +res.locals.user.id;

    let { items: newItems } = cart;
    const data = await orderService.getAllOrders(
      req.query,
      true,
      false,
      +res.locals.user.id
    );
    //kiểm tra cart của user
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
      const id = userCart.id;

      newItems.forEach((newItem: any) => {
        // Check xem newItem có trong giỏ hàng chưa ?

        const index = cartItems.findIndex(
          (cartItem: any) =>
            newItem.productVariantId === cartItem.productVariantId
        );

        // Nếu có trong giỏ hàng
        if (index !== -1) {
          console.log("Có trong giỏ hàng");
          // if (newItem.quantity !== cartItems[index].quantity) {
          updateItems.push(
            orderItemService.updateOrderItem(
              cartItems[index].id,
              newItem.quantity + cartItems[index].quantity
            )
          );
          // }
        }
        // Nếu không có trong giỏ hàng
        else {
          console.log("Không có trong giỏ hàng");
          createItems.push(
            orderItemService.createOrderItem({
              orderId: id,
              quantity: newItem.quantity,
              productVariantId: newItem.productVariantId,
              price: newItem.price,
            })
          );
        }
      });

      // cartItems.forEach((cartItem) => {
      //   const index = newItems.findIndex(
      //     (newItem: any) =>
      //       newItem.productVariantId === cartItem.productVariantId
      //   );
      //   //nếu item mới đã có trong giỏ hàng thì cập nhật số lượng
      //   if (index !== -1) {
      //     if (cartItem.quantity !== newItems[index].quantity) {
      //       updateItems.push(
      //         orderItemService.updateOrderItem(
      //           cartItem.id,
      //           newItems[index].quantity
      //         )
      //       );
      //     }
      //   }
      // });

      // if (newItems.length > 0) {
      //   const id = userCart.id;
      //   newItems.forEach((item: any) => {
      //     createItems.push(
      //       orderItemService.createOrderItem({
      //         orderId: id,
      //         quantity: item.quantity,
      //         productVariantId: item.productVariantId,
      //         price: item.price,
      //       })
      //     );
      //   });
      // }

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

    return res.status(STATUS_INTERVAL_ERROR).json(helper.responseError());
  }
  async updateCartItem(req: Request, res: Response) {
    if (req.body.newQuantity < 1) {
      const result = await orderItemService.deleteOrderItem(+req.params.id);
      if (!result) {
        return res.status(STATUS_INTERVAL_ERROR).json(helper.responseError());
      }
      return res.status(STATUS_OK).json(helper.responseSuccess());
    }
    const data = await orderItemService.updateOrderItem(
      +req.params.id,
      req.body.newQuantity
    );
    if (!data) {
      return res.status(STATUS_INTERVAL_ERROR).json(helper.responseError());
    }
    return res.status(STATUS_OK).json(helper.responseSuccess(data));
  }
  async deleteCartItem(req: Request, res: Response) {
    const result = await orderItemService.deleteOrderItem(+req.params.id);
    if (!result) {
      return res.status(STATUS_INTERVAL_ERROR).json(helper.responseError());
    }
    return res.status(STATUS_OK).json(helper.responseSuccess());
  }
}

const cartController = new CartController();

export default cartController;
