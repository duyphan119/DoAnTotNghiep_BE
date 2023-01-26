import { AppDataSource } from "../data-source";
import orderService from "./order.service";
import OrderDiscount from "../entities/orderdiscount.entity";

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
}

export default new OrderDiscountService();
