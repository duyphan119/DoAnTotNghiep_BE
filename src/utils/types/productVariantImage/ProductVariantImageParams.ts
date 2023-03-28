import QueryParams from "../QueryParams";

type ProductVariantImageParams = Partial<{
  productId: string;
}> &
  QueryParams;

export default ProductVariantImageParams;
