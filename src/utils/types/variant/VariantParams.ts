import SearchParams from "../SearchParams";

type VariantParams = SearchParams &
  Partial<{
    name: string;
    variant_values: string;
  }>;

export default VariantParams;
