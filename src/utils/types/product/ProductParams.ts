import SearchParams from "../SearchParams";

type ProductParams = SearchParams &
  Partial<{
    name: string;
    slug: string;
    group_product_slug: string;
    group_product: string;
    v_ids: string;
    min_price: string;
    max_price: string;
    product_variants: string;
    images: string;
  }>;

export default ProductParams;
