import { IsNull, Not } from "typeorm";
import { AppDataSource } from "../data-source";
import Order from "../entities/order.entity";
import { handlePagination, handleSort } from "../utils";
import { QueryParams, ResponseData } from "../utils/types";
import orderitemService from "./orderitem.service";
import userService from "./user.service";

type OrderQueryParams = QueryParams &
  Partial<{
    start: string;
    end: string;
    address: string;
    fullName: string;
    items: string;
  }>;

type CheckoutDTO = {
  province: string;
  district: string;
  ward: string;
  address: string;
  paymentMethod: string;
  shippingPrice: number;
  fullName: string;
  phone: string;
};

class OrderService {
  getRepository() {
    return AppDataSource.getRepository(Order);
  }

  getAllOrders(
    query: OrderQueryParams,
    isCart: boolean,
    isAdmin: boolean,
    userId?: number
  ): Promise<ResponseData> {
    return new Promise(async (resolve, _) => {
      try {
        const { items, withDeleted } = query;
        const { sort } = handleSort(query);
        const { wherePagination } = handlePagination(query);
        let [orders, count] = await this.getRepository().findAndCount({
          order: sort,
          ...wherePagination,
          relations: {
            ...(items
              ? {
                  items: {
                    product: { images: true },
                    productVariant: { variantValues: true },
                  },
                }
              : {}),
          },
          withDeleted: isAdmin && withDeleted ? true : false,
          where: {
            status: isCart ? IsNull() : Not(IsNull()),
            ...(userId ? { userId } : {}),
          },
        });
        resolve({ data: { items: orders, count } });
      } catch (error) {
        console.log("GET ALL ORDERS ERROR", error);
        resolve({ error });
      }
    });
  }
  getOrderById(id: number): Promise<ResponseData> {
    return new Promise(async (resolve, _) => {
      try {
        const order = await this.getRepository().findOne({
          where: { id },
          relations: {
            items: {
              product: { images: true },
              productVariant: { variantValues: true },
            },
            discount: true,
          },
        });
        resolve({ data: order });
      } catch (error) {
        console.log("GET ORDER BY ID ERROR", error);
        resolve({ error });
      }
    });
  }
  createCart(userId: number): Promise<ResponseData> {
    return new Promise(async (resolve, _) => {
      try {
        const { data: user } = await userService.getById(userId);
        if (user) {
          const cart = await this.getRepository().save({
            userId,
            fullName: user.fullName,
            phone: user.phone,
          });
          resolve({ data: cart });
        }
        resolve({});
      } catch (error) {
        console.log("CREATE CART ERROR", error);
        resolve({ error });
      }
    });
  }
  checkout(userId: number, dto: CheckoutDTO): Promise<ResponseData> {
    return new Promise(async (resolve, _) => {
      try {
        let order = await this.getRepository().findOne({
          where: {
            userId,
            status: IsNull(),
          },
          relations: {
            items: {
              productVariant: true,
            },
          },
        });
        if (order) {
          const newOrder = await this.getRepository().save({
            ...order,
            ...dto,
            status: "Đang xử lý",
          });

          resolve({ data: newOrder });
        }
        resolve({});
      } catch (error) {
        console.log("CHECKOUT ERROR", error);
        resolve({ error });
      }
    });
  }
  updateStatus(id: number, newStatus: string): Promise<ResponseData> {
    return new Promise(async (resolve, _) => {
      try {
        let order = await this.getRepository().findOneBy({ id });
        if (order) {
          const oldStatus = order.status;
          if (oldStatus === "Đang xử lý" && newStatus === "Đang giao hàng") {
            await orderitemService.updateInventory(order.id);
            const newOrder = await this.getRepository().save({
              ...order,
              status: newStatus,
            });
            resolve({ data: newOrder });
          }
        }
        resolve({});
      } catch (error) {
        console.log("CHECKOUT ERROR", error);
        resolve({ error });
      }
    });
  }
}

export default new OrderService();
