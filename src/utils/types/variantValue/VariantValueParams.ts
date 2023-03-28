import SearchParams from "../SearchParams";

type VariantValueParams = SearchParams &
  Partial<{
    variant: string;
    value: string;
    type: string;
  }>;

export default VariantValueParams;
