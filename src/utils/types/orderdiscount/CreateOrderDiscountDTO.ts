type CreateOrderDiscountDTO = {
  code: string;
  start: Date;
  end: Date;
  minPrice: number;
  value: number;
};

export default CreateOrderDiscountDTO;
