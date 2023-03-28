import SearchParams from "../SearchParams";

type OrderDiscountParams = Partial<{
  code: string;
  start: string;
  end: string;
  minValue: string;
  value: string;
}> &
  SearchParams;

export default OrderDiscountParams;
