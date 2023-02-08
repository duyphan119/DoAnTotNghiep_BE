import VariantValue from "../../../entities/variantValue.entity";

type CreateProductVariantDTO = {
  productId: number;
  price: number;
  inventory: number;
  name: string;
  variantValues: VariantValue[];
};

export default CreateProductVariantDTO;
