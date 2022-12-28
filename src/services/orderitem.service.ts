import { AppDataSource } from "../data-source";
import OrderItem from "../entities/orderitem.entity";
import { ResponseData } from "../utils/types";
import productService from "./product.service";
import productVariantService from "./productvariant.service";

export type CreateOrderItemDTO = {
  quantity: number;
  productId: number;
  orderId: number;
} & Partial<{ productVariantId: number; price: number }>;

class OrderItemService {
  getRepository() {
    return AppDataSource.getRepository(OrderItem);
  }
  getById(id: number, relations?: boolean): Promise<ResponseData> {
    return new Promise(async (resolve, _) => {
      try {
        const orderItem = await this.getRepository().findOne({
          where: { id },
          ...(relations
            ? {
                relations: {
                  product: {
                    images: true,
                  },
                  productVariant: {
                    variantValues: {
                      variant: true,
                    },
                  },
                },
              }
            : {}),
        });
        resolve({ data: orderItem });
      } catch (error) {
        console.log("GET ORDER ITEM BY ID ERROR", error);
        resolve({ error });
      }
    });
  }
  updateInventory(orderId: number) {
    return new Promise(async (resolve, _) => {
      try {
        const orderItems = await this.getRepository().find({
          where: { orderId },
          relations: { productVariant: true },
        });
        const promises: Promise<any>[] = [];
        orderItems.forEach((orderItem) => {
          if (orderItem.productVariant) {
            promises.push(
              productVariantService.updateProductVariant(
                orderItem.productVariant.id,
                {
                  inventory:
                    orderItem.productVariant.inventory - orderItem.quantity,
                }
              )
            );
          } else {
            promises.push(
              productService.updateProduct(orderItem.product.id, {
                inventory: orderItem.product.inventory - orderItem.quantity,
              })
            );
          }
        });
        await Promise.all(promises);
        resolve({});
      } catch (error) {
        console.log("UPDATE INVENTORY ERROR", error);
        resolve({ error });
      }
    });
  }

  deleteOrderItem(id: number): Promise<ResponseData> {
    return new Promise(async (resolve, _) => {
      try {
        await this.getRepository().delete({ id });
        resolve({});
      } catch (error) {
        console.log("DELETE ORDER ITEM ERROR", error);
        resolve({ error });
      }
    });
  }

  updateOrderItem(id: number, dto: Partial<OrderItem>): Promise<ResponseData> {
    return new Promise(async (resolve, _) => {
      try {
        const orderItem = await this.getRepository().findOneBy({ id });
        if (orderItem) {
          const newOrderItem = await this.getRepository().save({
            ...orderItem,
            ...dto,
          });
          resolve({ data: newOrderItem });
        }
        resolve({});
      } catch (error) {
        console.log("UPDATE ORDER ITEM ERROR", error);
        resolve({ error });
      }
    });
  }

  createOrderItem(dto: CreateOrderItemDTO): Promise<ResponseData> {
    return new Promise(async (resolve, _) => {
      try {
        const orderItem = await this.getRepository().findOneBy({
          productId: dto.productId,
          orderId: dto.orderId,
          ...(dto.productVariantId
            ? { productVariantId: dto.productVariantId }
            : {}),
        });
        const newOrderItem = await this.getRepository().save(
          orderItem
            ? {
                ...dto,
                quantity: dto.quantity + orderItem.quantity,
              }
            : dto
        );
        resolve({ data: newOrderItem });
      } catch (error) {
        console.log("CREATE ORDER ITEM ERROR", error);
        resolve({ error });
      }
    });
  }
}

export default new OrderItemService();
