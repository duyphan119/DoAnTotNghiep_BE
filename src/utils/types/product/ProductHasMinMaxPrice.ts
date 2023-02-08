import Product from "../../../entities/product.entity";

type ProductHasMinMaxPrice = Product & {
  minPrice: number;
  maxPrice: number;
};

export default ProductHasMinMaxPrice;
