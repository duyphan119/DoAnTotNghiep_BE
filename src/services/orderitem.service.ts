import { AppDataSource } from "../data-source";
import OrderItem from "../entities/orderItem.entity";
import ProductVariant from "../entities/productVariant.entity";
import { ResponseData } from "../utils/types";
import productVariantService from "./productVariant.service";

export type CreateOrderItemDTO = {
  quantity: number;
  productVariantId: number;
  orderId: number;
} & Partial<{ price: number }>;

class OrderItemService {
  getRepository() {
    return AppDataSource.getRepository(OrderItem);
  }

  getById(id: number, relations?: boolean): Promise<OrderItem | null> {
    return new Promise(async (resolve, _) => {
      try {
        const orderItem = await this.getRepository().findOne({
          where: { id },
          ...(relations
            ? {
                relations: {
                  productVariant: {
                    variantValues: {
                      variant: true,
                    },
                    product: {
                      images: true,
                    },
                  },
                  order: true,
                },
              }
            : {}),
        });
        resolve(orderItem);
      } catch (error) {
        console.log("GET ORDER ITEM BY ID ERROR", error);
        resolve(null);
      }
    });
  }
  updateInventory(orderId: number): Promise<boolean> {
    return new Promise(async (resolve, _) => {
      try {
        const orderItems = await this.getRepository().find({
          where: { orderId },
          relations: { productVariant: true },
        });
        const promises: Promise<any>[] = [];
        orderItems.forEach((orderItem: OrderItem) => {
          if (orderItem.productVariant) {
            promises.push(
              productVariantService.updateOne(orderItem.productVariant.id, {
                inventory:
                  orderItem.productVariant.inventory - orderItem.quantity,
              })
            );
          } else {
            let productVariant: ProductVariant = orderItem.productVariant;
            promises.push(
              productVariantService.updateOne(orderItem.productVariantId, {
                inventory: productVariant.inventory - orderItem.quantity,
              })
            );
          }
        });
        await Promise.all(promises);
        resolve(true);
      } catch (error) {
        console.log("UPDATE INVENTORY ERROR", error);
        resolve(false);
      }
    });
  }

  deleteOrderItem(id: number): Promise<boolean> {
    return new Promise(async (resolve, _) => {
      try {
        await this.getRepository().delete({ id });
        resolve(true);
      } catch (error) {
        console.log("DELETE ORDER ITEM ERROR", error);
        resolve(false);
      }
    });
  }

  updateOrderItem(id: number, newQuantity: number): Promise<OrderItem | null> {
    return new Promise(async (resolve, _) => {
      try {
        const orderItem = await this.getRepository().findOneBy({ id });
        if (orderItem) {
          const newOrderItem = await this.getRepository().save({
            ...orderItem,
            quantity: newQuantity,
          });
          resolve(newOrderItem);
        }
      } catch (error) {
        console.log("UPDATE ORDER ITEM ERROR", error);
      }
      resolve(null);
    });
  }

  createOrderItem(dto: CreateOrderItemDTO): Promise<OrderItem | null> {
    return new Promise(async (resolve, _) => {
      try {
        const orderItem = await this.getRepository().findOneBy({
          // productId: dto.productId,
          orderId: dto.orderId,
          productVariantId: dto.productVariantId,
          // ...(dto.productVariantId
          //   ? { productVariantId: dto.productVariantId }
          //   : {}),
        });
        const newOrderItem = await this.getRepository().save(
          orderItem
            ? {
                ...dto,
                quantity: dto.quantity + orderItem.quantity,
              }
            : dto
        );
        resolve(newOrderItem);
      } catch (error) {
        console.log("CREATE ORDER ITEM ERROR", error);
        resolve(null);
      }
    });
  }
}

const orderItemService = new OrderItemService();

export default orderItemService;
