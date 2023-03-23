import SearchParams from "../SearchParams";

type ProductVariantParams = SearchParams &
  Partial<{
    productId: string;
    variant_values: string;
  }>;

export default ProductVariantParams;
