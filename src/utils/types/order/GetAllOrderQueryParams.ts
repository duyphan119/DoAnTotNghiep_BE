import QueryParams from "../QueryParams";

type GetAllOrderQueryParams = QueryParams &
  Partial<{
    start: string;
    end: string;
    address: string;
    fullName: string;
    items: string;
  }>;

export default GetAllOrderQueryParams;
