import { AppDataSource } from "../data-source";
import OrderDiscount from "../entities/orderdiscount.entity";
import GetAllType from "../utils/types/GetAll";
import orderService from "./order.service";

export type CreateOrderDiscountDTO = {
  code: string;
  start: Date;
  end: Date;
  minPrice: number;
  value: number;
};

class OrderDiscountService {
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
        console.log("CHECK ORDER DISCOUNT ERROR", error);
      }
      resolve(false);
    });
  }

  create(dto: CreateOrderDiscountDTO): Promise<OrderDiscount | null> {
    return new Promise(async (resolve, _) => {
      try {
        const item = await this.getRepository().save(dto);

        resolve(item);
      } catch (error) {
        console.log("CHECK ORDER DISCOUNT ERROR", error);
        resolve(null);
      }
    });
  }

  getAll(query: any): Promise<GetAllType<OrderDiscount>> {
    return new Promise(async (resolve, _) => {
      try {
        const [items, count] = await this.getRepository().findAndCount();
        resolve({ items, count });
      } catch (error) {
        console.log("GET ALL ORDER DISCOUNTS ERROR", error);
        resolve({ items: [], count: 0 });
      }
    });
  }
}

export default new OrderDiscountService();
