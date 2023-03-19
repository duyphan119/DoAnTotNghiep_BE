import SearchParams from "../SearchParams";

type VariantValueQueryParams = SearchParams &
  Partial<{
    variant: string;
    value: string;
    type: string;
  }>;

export default VariantValueQueryParams;
