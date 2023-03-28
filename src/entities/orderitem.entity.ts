import { IsNumber, Min } from "class-validator";
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import Order from "./order.entity";
import ProductVariant from "./productVariant.entity";

@Entity({ name: "chitietdonhang" })
class OrderItem {
  @PrimaryGeneratedColumn({ name: "machitietdonhang" })
  id: number;

  @Column({ nullable: false, name: "madonhang" })
  @IsNumber(
    {},
    {
      message: "This field must be number",
    }
  )
  orderId: number;

  @Column({ nullable: true, name: "mahangbienthe" })
  @IsNumber(
    {},
    {
      message: "This field must be number",
    }
  )
  productVariantId: number;

  @Column({ nullable: false, name: "soluong" })
  @IsNumber(
    {},
    {
      message: "This field must be number",
    }
  )
  @Min(1, {
    message: "This field must be greater than or equal 1",
  })
  quantity: number;

  @Column({ nullable: false, name: "giaban" })
  @IsNumber(
    {},
    {
      message: "This field must be number",
    }
  )
  price: number;

  @CreateDateColumn({ name: "ngaytao" })
  createdAt: Date;

  @UpdateDateColumn({ name: "ngaycapnhat" })
  updatedAt: Date;

  // @ManyToOne(() => Product, (e) => e.items)
  // @JoinColumn({ name: "mahang", referencedColumnName: "id" })
  // product: Product;

  @ManyToOne(() => ProductVariant, (e) => e.items)
  @JoinColumn({ name: "mahangbienthe", referencedColumnName: "id" })
  productVariant: ProductVariant;

  @ManyToOne(() => Order, (e) => e.items)
  @JoinColumn({ name: "madonhang", referencedColumnName: "id" })
  order: Order;
}
export default OrderItem;
