import QueryParams from "../QueryParams";

type VariantQueryParams = QueryParams &
  Partial<{
    name: string;
    q: string;
    variant_values: string;
  }>;

export default VariantQueryParams;
