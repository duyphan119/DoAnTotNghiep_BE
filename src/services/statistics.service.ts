import { Statistics } from "../utils/types";
import commentProductService from "./commentProduct.service";
import orderService from "./order.service";
import productService from "./product.service";
import userService from "./user.service";

class StatisticsService {
  getStatistics(): Promise<Statistics | null> {
    return new Promise(async (resolve, _) => {
      let date = new Date();
      let currentMonth = date.getMonth() + 1;
      let currentYear = date.getFullYear();
      let lastMonth = currentMonth - 1;
      let lastYear = currentYear;
      if (currentMonth === 1) {
        lastMonth = 12;
        lastYear -= 1;
      }

      try {
        let countUser = await userService.countUserByMonth(
          currentYear,
          currentMonth
        );
        let countUserLastMonth = await userService.countUserByMonth(
          lastYear,
          lastMonth
        );
        let countOrder = await orderService.countOrderByMonth(
          currentYear,
          currentMonth
        );
        let countOrderLastMonth = await orderService.countOrderByMonth(
          lastYear,
          lastMonth
        );
        let countCommentProduct =
          await commentProductService.countCommentProductByMonth(
            currentYear,
            currentMonth
          );
        let countCommentProductLastMonth =
          await commentProductService.countCommentProductByMonth(
            lastYear,
            lastMonth
          );
        let revenueCurrentMonth = await orderService.revenueByMonth(
          currentYear,
          currentMonth
        );
        let revenueLastMonth = await orderService.revenueByMonth(
          lastYear,
          lastMonth
        );
        let listRevenueByMonth = await orderService.listRevenueByMonth(
          currentYear,
          currentMonth
        );
        let listRevenueToday = await orderService.listRevenueToday();
        // revenueCurrentMonth = revenueCurrentMonth.map((revenue: any) => ({
        //   key: `${revenue.month}-${revenue.year}`,
        //   value: +revenue.total,
        // }));
        listRevenueToday = listRevenueToday.map((revenue: any) => ({
          key: `${revenue.hour}g`,
          value: +revenue.total,
        }));
        let recentOrders = await orderService.recentOrders();
        let bestSellerProducts = await productService.bestSellers();
        let listRevenueByYear = await orderService.listRevenueByYear(
          currentYear
        );
        listRevenueByYear = listRevenueByYear.map((revenue: any) => ({
          key: `Th${revenue.month}`,
          value: +revenue.total,
        }));
        listRevenueByMonth = listRevenueByMonth.map((revenue: any) => ({
          key: `Ng${revenue.day}`,
          value: +revenue.total,
        }));
        resolve({
          countUser: {
            currentMonth: countUser,
            lastMonth: countUserLastMonth,
          },
          countOrder: {
            currentMonth: countOrder,
            lastMonth: countOrderLastMonth,
          },
          countCommentProduct: {
            currentMonth: countCommentProduct,
            lastMonth: countCommentProductLastMonth,
          },
          revenue: {
            currentMonth: revenueCurrentMonth,
            lastMonth: revenueLastMonth,
          },
          listRevenueByMonth,
          listRevenueToday,
          recentOrders,
          bestSellerProducts,
          listRevenueByYear,
        });
      } catch (error) {
        console.log("GET STATISTICS ERROR", error);
        resolve(null);
      }
    });
  }
}

export default new StatisticsService();
