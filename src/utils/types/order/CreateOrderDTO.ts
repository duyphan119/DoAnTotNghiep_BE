type CreateOrderDTO = {
  province: string;
  district: string;
  ward: string;
  address: string;
  paymentMethod: string;
  shippingPrice: number;
  fullName: string;
  phone: string;
  total: number;
  point?: number;
};

export default CreateOrderDTO;
