import QueryParams from "../QueryParams";

type GetAllProductVariantQueryParams = QueryParams &
  Partial<{
    productId: string;
    variant_values: string;
  }>;

export default GetAllProductVariantQueryParams;
