import QueryParams from "../QueryParams";

type GetAllProductQueryParams = QueryParams &
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

export default GetAllProductQueryParams;
