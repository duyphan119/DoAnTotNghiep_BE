type CreateProductDTO = {
  name: string;
  groupProductId: number;
  price: number;
} & Partial<{
  inventory: number;
  thumbnail: string;
  detail: string;
  description: string;
}>;

export default CreateProductDTO;
