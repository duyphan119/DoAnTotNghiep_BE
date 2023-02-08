import { Between, IsNull, Not } from "typeorm";
import { EMPTY_ITEMS } from "../constantList";
import { AppDataSource } from "../data-source";
import Order, { OrderStatusEnum } from "../entities/order.entity";
import OrderItem from "../entities/orderItem.entity";
import { handlePagination, handleSort, lastDay } from "../utils";
import { GetAll, QueryParams, ResponseData } from "../utils/types";
import { CreateOrderDTO, GetAllOrderQueryParams } from "../utils/types/order";
import orderItemService from "./orderItem.service";
import productVariantService from "./productVariant.service";
import userService from "./user.service";
import userAddressService from "./userAddress.service";

class OrderService {
  getRepository() {
    return AppDataSource.getRepository(Order);
  }
  getPoint(id: number): Promise<number> {
    return new Promise(async (resolve, _) => {
      try {
        const order = await this.getRepository().findOne({
          where: { id },
          relations: {
            items: true,
            discount: true,
          },
        });

        if (order) {
          let totalItems = order.items.reduce(
            (prev, current) => prev + current.price * current.quantity,
            0
          );
          resolve(
            Math.floor(
              (totalItems -
                (order.discount ? order.discount.value : 0) -
                order.shippingPrice) /
                20000
            )
          );
        }
        resolve(0);
      } catch (error) {
        console.log("GET POINT ERROR", error);
        resolve(0);
      }
    });
  }
  checkUserUseDiscount(userId: number, code: string): Promise<boolean> {
    return new Promise(async (resolve, _) => {
      try {
        const item = await this.getRepository().findOneBy({
          userId,
          discount: { code },
        });
        resolve(item ? true : false);
      } catch (error) {
        console.log("CHECH USER USE DISCOUNT ERROR", error);
      }

      resolve(false);
    });
  }
  recentOrders(): Promise<Order[]> {
    return new Promise(async (resolve, _) => {
      try {
        const items = await this.getRepository().find({
          order: {
            updatedAt: "desc",
          },
          where: { isOrdered: true },
          relations: {
            user: true,
          },
          take: 8,
        });
        resolve(items);
      } catch (error) {
        console.log("RECENT ORDERS ERROR", error);
      }
    });
  }
  getAllOrders(
    query: GetAllOrderQueryParams,
    isCart: boolean,
    isAdmin: boolean,
    userId?: number
  ): Promise<GetAll<Order>> {
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
                    productVariant: {
                      variantValues: { variant: true },
                      product: { images: true },
                    },
                  },
                }
              : {}),
          },
          withDeleted: isAdmin && withDeleted ? true : false,
          where: {
            status: isCart
              ? OrderStatusEnum.INCART
              : Not(OrderStatusEnum.INCART),
            ...(userId ? { userId } : {}),
          },
        });
        resolve({ items: orders, count });
      } catch (error) {
        console.log("GET ALL ORDERS ERROR", error);
        resolve(EMPTY_ITEMS);
      }
    });
  }
  getOrderById(id: number): Promise<Order | null> {
    return new Promise(async (resolve, _) => {
      try {
        const order = await this.getRepository().findOne({
          where: { id },
          relations: {
            items: {
              productVariant: {
                variantValues: true,
                product: { images: true },
              },
            },
            discount: true,
          },
        });
        resolve(order);
      } catch (error) {
        console.log("GET ORDER BY ID ERROR", error);
        resolve(null);
      }
    });
  }
  createCart(userId: number): Promise<Order | null> {
    return new Promise(async (resolve, _) => {
      try {
        const user = await userService.getById(userId);
        const userAddressData = await userAddressService.getByUserId(userId, {
          limit: "1",
        });
        if (user) {
          const userAddress = userAddressData?.items[0];
          const cart = await this.getRepository().save({
            userId,
            fullName: user.fullName,
            phone: user.phone,
            ...(userAddress
              ? {
                  province: userAddress.province,
                  district: userAddress.district,
                  ward: userAddress.ward,
                  address: userAddress.address,
                }
              : {}),
          });
          resolve(cart);
        }
      } catch (error) {
        console.log("CREATE CART ERROR", error);
        resolve(null);
      }
    });
  }
  getUserPoint(userId: number): Promise<number> {
    return new Promise(async (resolve, _) => {
      try {
        const user = await userService.getById(userId);

        if (user) {
          resolve(user.point);
        }
      } catch (error) {
        console.log("GET USER POINT ERROR", error);
      }

      resolve(0);
    });
  }
  checkout(userId: number, dto: CreateOrderDTO): Promise<Order | null> {
    return new Promise(async (resolve, _) => {
      try {
        const { point: pointDTO, ...otherDto } = dto;
        let order = await this.getRepository().findOne({
          where: {
            userId,
            isOrdered: false,
          },
          relations: {
            items: {
              productVariant: true,
            },
          },
        });

        let userPoint = await this.getUserPoint(userId);

        if (order) {
          const newOrder = await this.getRepository().save({
            ...order,
            ...otherDto,
            ...(pointDTO && userPoint >= pointDTO ? { point: pointDTO } : {}),
            status: OrderStatusEnum.PENDING,
            isOrdered: true,
            orderDate: new Date(),
          });

          const { userId } = order;
          const { province, district, ward, address } = dto;
          const userAddress = await userAddressService.getByDTO(userId, {
            province,
            district,
            ward,
            address,
          });

          if (!userAddress) {
            await userAddressService.createUserAddress(userId, {
              province,
              district,
              ward,
              address,
            });
          }

          resolve(newOrder);
        }
      } catch (error) {
        console.log("CHECKOUT ERROR", error);
        resolve(null);
      }
    });
  }
  countOrderByMonth(year: number, month: number): Promise<number> {
    return new Promise(async (resolve, _) => {
      try {
        const count = await this.getRepository().count({
          where: {
            createdAt: Between(
              new Date(`${year}-${month}-01`),
              new Date(`${year}-${month}-${lastDay(month, year)}`)
            ),
          },
        });

        resolve(count);
      } catch (error) {
        resolve(0);
      }
    });
  }
  maxRevenue(): Promise<any> {
    return new Promise(async (resolve, _) => {
      try {
      } catch (error) {
        console.log("MAX REVENUE ERROR", error);
        resolve(null);
      }
    });
  }
  revenueToday(): Promise<any> {
    return new Promise(async (resolve, _) => {
      try {
      } catch (error) {
        console.log("REVENUE TODAY ERROR", error);
        resolve(null);
      }
    });
  }
  listRevenueToday(): Promise<any> {
    return new Promise(async (resolve, _) => {
      try {
        let date = new Date();
        let day = date.getDate();
        let month = date.getMonth() + 1;
        let year = date.getFullYear();

        let data = await orderItemService
          .getRepository()
          .createQueryBuilder("ctdh")
          .leftJoinAndSelect("ctdh.order", "dh")
          .groupBy(`date_part('day', dh.ngaycapnhat)`)
          .addGroupBy(`date_part('month', dh.ngaycapnhat)`)
          .addGroupBy(`date_part('year', dh.ngaycapnhat)`)
          .addGroupBy(`date_part('hour',dh.ngaycapnhat)`)
          .select("sum(ctdh.giaban)", "total")
          .addSelect(`date_part('day', dh.ngaycapnhat)`, "day")
          .addSelect(`date_part('month', dh.ngaycapnhat)`, "month")
          .addSelect(`date_part('year', dh.ngaycapnhat)`, "year")
          .addSelect(`date_part('hour',dh.ngaycapnhat)`, "hour")
          .where("date_part('day', dh.ngaycapnhat) = :day", { day })
          .andWhere("date_part('year', dh.ngaycapnhat) = :year", { year })
          .andWhere("date_part('month', dh.ngaycapnhat) = :month", { month })
          .andWhere("dh.dathanhtoan = :isPaid", { isPaid: true })
          .orderBy(`date_part('hour',dh.ngaycapnhat)`, "ASC")
          .getRawMany();
        resolve(data);
      } catch (error) {
        console.log("LIST REVENUE TODAY ERROR", error);
        resolve({});
      }
    });
  }
  listRevenueByMonth(year: number, month: number): Promise<any> {
    return new Promise(async (resolve, _) => {
      try {
        const data = await orderItemService
          .getRepository()
          .createQueryBuilder("ctdh")
          .leftJoinAndSelect("ctdh.order", "dh")
          .groupBy(`date_part('day', dh.ngaydat)`)
          .addGroupBy(`date_part('month', dh.ngaydat)`)
          .addGroupBy(`date_part('year', dh.ngaydat)`)
          .select("sum(ctdh.giaban)", "total")
          .addSelect(`date_part('day', dh.ngaydat)`, "day")
          .addSelect(`date_part('month', dh.ngaydat)`, "month")
          .addSelect(`date_part('year', dh.ngaydat)`, "year")
          .where("dh.ngaydat between :startDate and :endDate", {
            startDate: new Date(`${year}-${month}-01`),
            endDate: new Date(`${year}-${month}-${lastDay(month, year)}`),
          })
          .andWhere("dh.dathanhtoan = :isPaid", { isPaid: true })
          .orderBy("date_part('day', dh.ngaydat)", "ASC")
          .getRawMany();

        resolve(data);
      } catch (error) {
        console.log("LIST REVENUE BY MONTH ERROR", error);
        resolve({});
      }
    });
  }
  listRevenueByYear(year: number): Promise<any> {
    return new Promise(async (resolve, _) => {
      try {
        const data = await orderItemService
          .getRepository()
          .createQueryBuilder("ctdh")
          .leftJoinAndSelect("ctdh.order", "dh")
          .groupBy(`date_part('month', dh.ngaydat)`)
          .addGroupBy(`date_part('year', dh.ngaydat)`)
          .select("sum(ctdh.giaban)", "total")
          .addSelect(`date_part('month', dh.ngaydat)`, "month")
          .addSelect(`date_part('year', dh.ngaydat)`, "year")
          .where("date_part('year', dh.ngaydat) = :year", { year })
          .andWhere("dh.dathanhtoan = :isPaid", { isPaid: true })
          .orderBy("date_part('month', dh.ngaydat)", "ASC")
          .getRawMany();
        resolve(data);
      } catch (error) {
        console.log("LIST REVENUE BY YEAR ERROR", error);
        resolve({});
      }
    });
  }
  revenueByMonth(year: number, month: number): Promise<number> {
    return new Promise(async (resolve, _) => {
      try {
        const data = await orderItemService
          .getRepository()
          .createQueryBuilder("ctdh")
          .leftJoin("ctdh.order", "dh")
          .select("sum(ctdh.giaban)", "total")
          .where("dh.ngaydat between :startDate and :endDate", {
            startDate: new Date(`${year}-${month}-01`),
            endDate: new Date(`${year}-${month}-${lastDay(month, year)}`),
          })
          .andWhere("dh.dathanhtoan = :isPaid", { isPaid: true })
          .getRawOne();
        if (data && data.total) resolve(+data.total);
        resolve(0);
      } catch (error) {
        resolve(0);
      }
    });
  }
  updateStatus(id: number): Promise<Order | null> {
    return new Promise(async (resolve, _) => {
      try {
        let order = await this.getOrderById(id);
        console.log("order:::", order);
        if (order) {
          const { allowCannceled, isPaid, isOrdered } = order;
          if (isOrdered) {
            if (allowCannceled && !isPaid) {
              order.status = OrderStatusEnum.DELIVERING;
              order.isPaid = false;
              order.allowCannceled = false;
              order.isOrdered = true;
            } else if (!allowCannceled && !isPaid) {
              order.status = OrderStatusEnum.DELIVERED;
              order.isPaid = true;
              order.isOrdered = true;
              order.allowCannceled = false;
              const point = await this.getPoint(order.id);

              await productVariantService.updateProductVariants(
                order.items.map((item: OrderItem) => ({
                  id: item.productVariantId,
                  inventory: item.productVariant.inventory - item.quantity,
                }))
              );

              await userService.updatePoint(order.userId, point);
            }
          }
          const newOrder = await this.getRepository().save(order);
          resolve(newOrder);
        }
      } catch (error) {
        console.log("CHECKOUT ERROR", error);
      }
      resolve(null);
    });
  }
}

const orderService = new OrderService();

export default orderService;
