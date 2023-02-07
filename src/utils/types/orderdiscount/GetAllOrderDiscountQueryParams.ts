import QueryParams from "../QueryParams";

type GetAllOrderDiscountQueryParams = Partial<{
  code: string;
  start: string;
  end: string;
  minValue: string;
  value: string;
}> &
  QueryParams;

export default GetAllOrderDiscountQueryParams;
