import { In } from "typeorm";
import { EMPTY_ITEMS } from "../constantList";
import { AppDataSource } from "../data-source";
import OrderDiscount from "../entities/orderDiscount.entity";
import { handleEqual, handlePagination, handleSort } from "../utils";
import { ICrudService } from "../utils/interfaces";
import { SearchParams } from "../utils/types";
import GetAll from "../utils/types/GetAllT";
import {
  CreateOrderDiscountDTO,
  GetAllOrderDiscountQueryParams,
} from "../utils/types/orderDiscount";
import orderService from "./order.service";

class OrderDiscountService
  implements
    ICrudService<
      GetAll<OrderDiscount>,
      OrderDiscount,
      GetAllOrderDiscountQueryParams,
      CreateOrderDiscountDTO,
      Partial<CreateOrderDiscountDTO>
    >
{
  getById(id: number): Promise<OrderDiscount | null> {
    return new Promise(async (resolve, _) => {
      try {
        const OrderDiscount = await this.getRepository().findOneBy({ id });
        resolve(OrderDiscount);
      } catch (error) {
        console.log("OrderDiscountService.getById error", error);
        resolve(null);
      }
    });
  }
  createOne(dto: CreateOrderDiscountDTO): Promise<OrderDiscount | null> {
    return new Promise(async (resolve, _) => {
      try {
        const newItem = await this.getRepository().save(dto);
        resolve(newItem);
      } catch (error) {
        console.log("OrderDiscountService.createOne", error);
        resolve(null);
      }
    });
  }
  createMany(listDto: CreateOrderDiscountDTO[]): Promise<OrderDiscount[]> {
    return new Promise(async (resolve, _) => {
      try {
        const newItems = await this.getRepository().save(listDto);
        resolve(newItems);
      } catch (error) {
        console.log("OrderDiscountService.createMany error", error);
        resolve([]);
      }
    });
  }
  updateOne(
    id: number,
    dto: Partial<CreateOrderDiscountDTO>
  ): Promise<OrderDiscount | null> {
    return new Promise(async (resolve, _) => {
      try {
        await this.getRepository().update({ id }, dto);
        const existingItem = await this.getRepository().findOneBy({ id });
        resolve(existingItem);
      } catch (error) {
        console.log("OrderDiscountService.updateOne error", error);
      }
      resolve(null);
    });
  }
  updateMany(
    inputs: ({ id: number } & Partial<CreateOrderDiscountDTO>)[]
  ): Promise<OrderDiscount[]> {
    return new Promise(async (resolve, _) => {
      try {
        await Promise.all(
          inputs.map(
            (input: { id: number } & Partial<CreateOrderDiscountDTO>) => {
              const { id, ...dto } = input;
              return this.getRepository().update({ id }, dto);
            }
          )
        );
        resolve(
          await this.getRepository().find({
            where: {
              id: In(
                inputs.map(
                  (input: { id: number } & Partial<CreateOrderDiscountDTO>) =>
                    input.id
                )
              ),
            },
          })
        );
      } catch (error) {
        console.log("OrderDiscountService.updateMany error", error);
        resolve([]);
      }
    });
  }
  deleteOne(id: number): Promise<boolean> {
    return new Promise(async (resolve, _) => {
      try {
        await this.getRepository().delete(id);
        resolve(true);
      } catch (error) {
        console.log("OrderDiscountService.deleteOne error", error);
        resolve(false);
      }
    });
  }
  deleteMany(listId: number[]): Promise<boolean> {
    return new Promise(async (resolve, _) => {
      try {
        await this.getRepository().delete(listId);
        resolve(true);
      } catch (error) {
        console.log("OrderDiscountService.deleteMany error", error);
        resolve(false);
      }
    });
  }
  softDeleteOne(id: number): Promise<boolean> {
    return new Promise(async (resolve, _) => {
      try {
        await this.getRepository().softDelete(id);
        resolve(true);
      } catch (error) {
        console.log("OrderDiscountService.softDeleteOne error", error);
        resolve(false);
      }
    });
  }
  softDeleteMany(listId: number[]): Promise<boolean> {
    return new Promise(async (resolve, _) => {
      try {
        await this.getRepository().softDelete(listId);
        resolve(true);
      } catch (error) {
        console.log("OrderDiscountService.softDeleteMany error", error);
        resolve(false);
      }
    });
  }
  restoreOne(id: number): Promise<boolean> {
    return new Promise(async (resolve, _) => {
      try {
        await this.getRepository().restore(id);
        resolve(true);
      } catch (error) {
        console.log("OrderDiscountService.restoreOne error", error);
        resolve(false);
      }
    });
  }
  restoreMany(listId: number[]): Promise<boolean> {
    return new Promise(async (resolve, _) => {
      try {
        await this.getRepository().restore(listId);
        resolve(true);
      } catch (error) {
        console.log("OrderDiscountService.restoreMany error", error);
        resolve(false);
      }
    });
  }
  search(params: SearchParams): Promise<GetAll<OrderDiscount>> {
    return new Promise(async (resolve, _) => {
      try {
        const { q } = params;
        const { sort } = handleSort(params);
        const { wherePagination } = handlePagination(params);
        const [items, count] = await this.getRepository().findAndCount({
          order: sort,
          ...wherePagination,
          where: [handleEqual("code", q)],
        });
        resolve({ items, count });
      } catch (error) {
        console.log("OrderDiscountService.search", error);
        resolve(EMPTY_ITEMS);
      }
    });
  }
  getRepository() {
    return AppDataSource.getRepository(OrderDiscount);
  }

  getByCode(code: string): Promise<OrderDiscount | null> {
    return this.getRepository().findOneBy({ code });
  }

  check(userId: number, code: string, total: number): Promise<boolean> {
    return new Promise(async (resolve, _) => {
      try {
        let resultCheck = false;
        // Kiểm tra code hợp lệ
        const findOrderDiscount = await this.getRepository().findOneBy({
          code,
        });

        if (findOrderDiscount && findOrderDiscount.minPrice <= total) {
          // Kiểm tra người dùng dùng mã này chưa
          const result = await orderService.checkUserUseDiscount(userId, code);

          if (!result) {
            resultCheck = true;
          }
        }

        resolve(resultCheck);
      } catch (error) {
        console.log("OrderDiscountService.check", error);
      }
      resolve(false);
    });
  }

  getAll(
    params: GetAllOrderDiscountQueryParams
  ): Promise<GetAll<OrderDiscount>> {
    return new Promise(async (resolve, _) => {
      try {
        const { q } = params;
        const { sort } = handleSort(params);
        const { wherePagination } = handlePagination(params);
        if (q) resolve(await this.search(params));
        else {
          const { code } = params;
          const [items, count] = await this.getRepository().findAndCount({
            order: sort,
            ...wherePagination,
            where: {
              ...handleEqual("code", code),
            },
          });
          resolve({ items, count });
        }
      } catch (error) {
        console.log("OrderDiscountService.getAll", error);
        resolve(EMPTY_ITEMS);
      }
    });
  }
}

const orderDiscountService = new OrderDiscountService();

export default orderDiscountService;
