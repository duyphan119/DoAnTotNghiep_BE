import Order from "../../../entities/order.entity";
import { BestSellerProduct } from "../product";

type Statistics = {
  countUser: {
    currentMonth: number;
    lastMonth: number;
  };
  countOrder: {
    currentMonth: number;
    lastMonth: number;
  };
  countCommentProduct: {
    currentMonth: number;
    lastMonth: number;
  };
  revenue: {
    currentMonth: number;
    lastMonth: number;
  };
  listRevenueByMonth: any;
  listRevenueToday: any;
  recentOrders: Order[];
  bestSellerProducts: BestSellerProduct[];
  listRevenueByYear: any;
};

export default Statistics;
