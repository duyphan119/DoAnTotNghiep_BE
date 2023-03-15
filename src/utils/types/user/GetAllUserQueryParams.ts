import SearchParams from "../SearchParams";

type GetAllUserQueryParams = SearchParams &
  Partial<{
    fullName: string;
    phone: string;
    email: string;
  }>;

export default GetAllUserQueryParams;
