import QueryParams from "../QueryParams";

type GetAllUserQueryParams = QueryParams &
  Partial<{
    fullName: string;
    phone: string;
    email: string;
  }>;

export default GetAllUserQueryParams;
