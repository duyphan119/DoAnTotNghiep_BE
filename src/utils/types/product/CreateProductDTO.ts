import VariantValue from "../../../entities/variantValue.entity";

type CreateProductDTO = {
  name: string;
  groupProductId: number;
  price: number;
  productVariants: Array<{
    price: number;
    inventory: number;
    variantValues: VariantValue[];
    name: string;
  }>;
  images: Array<{
    path: string;
    variantValueId: number | null;
  }>;
} & Partial<{
  inventory: number;
  thumbnail: string;
  detail: string;
  description: string;
}>;

export default CreateProductDTO;
