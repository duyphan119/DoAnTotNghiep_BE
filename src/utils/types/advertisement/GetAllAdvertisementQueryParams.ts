import QueryParams from "../QueryParams";

type GetAllAdvertisementQueryParams = QueryParams &
  Partial<{
    title: string;
    page: string;
  }>;

export default GetAllAdvertisementQueryParams;
