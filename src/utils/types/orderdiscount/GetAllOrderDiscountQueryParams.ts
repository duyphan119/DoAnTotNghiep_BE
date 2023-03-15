import SearchParams from "../SearchParams";

type GetAllOrderDiscountQueryParams = Partial<{
  code: string;
  start: string;
  end: string;
  minValue: string;
  value: string;
}> &
  SearchParams;

export default GetAllOrderDiscountQueryParams;
