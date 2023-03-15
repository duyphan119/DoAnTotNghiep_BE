import QueryParams from "../QueryParams";

type GetAllProductVariantImageQueryParams = Partial<{
  productId: string;
}> &
  QueryParams;

export default GetAllProductVariantImageQueryParams;
