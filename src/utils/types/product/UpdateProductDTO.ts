import ProductVariantImage from "../../../entities/productVarianImage.entity";
import ProductVariant from "../../../entities/productVariant.entity";
import VariantValue from "../../../entities/variantValue.entity";

type UpdateProductDTO = Partial<{
  name: string;
  groupProductId: number;
  price: number;
  inventory: number;
  detail: string;
  description: string;
  metaKeywords: string;
  metaDescription: string;
  productVariants: Array<ProductVariant>;
  newProductVariants: Array<{
    price: number;
    inventory: number;
    variantValues: VariantValue[];
    name: string;
  }>;
  images: Array<ProductVariantImage[]>;
  newImages: Array<{
    path: string;
    variantValueId: number;
  }>;
  deleteImages: number[];
  updateImages: Array<{
    id: number;
    variantValueId: number;
  }>;
}>;

export default UpdateProductDTO;
