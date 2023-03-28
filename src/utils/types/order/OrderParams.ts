import SearchParams from "../SearchParams";

type OrderParams = SearchParams &
  Partial<{
    address: string;
    fullName: string;
    items: string;
    province: string;
    district: string;
    ward: string;
    phone: string;
    discount: string;
  }>;

export default OrderParams;
