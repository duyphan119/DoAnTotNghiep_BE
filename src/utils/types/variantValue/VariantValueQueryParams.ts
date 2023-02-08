import QueryParams from "../QueryParams";

type VariantValueQueryParams = QueryParams &
  Partial<{
    variant: string;
    value: string;
    type: string;
  }>;

export default VariantValueQueryParams;
