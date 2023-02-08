export type CreateOrderItemDTO = {
  quantity: number;
  productVariantId: number;
  orderId: number;
} & Partial<{ price: number }>;

export default CreateOrderItemDTO;
