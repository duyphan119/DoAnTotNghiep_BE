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
  @IsNumber()
  orderId: number;

  // @Column({ nullable: false, name: "mahang" })
  // @IsNumber()
  // productId: number;

  @Column({ nullable: true, name: "mahangbienthe" })
  @IsNumber()
  productVariantId: number;

  @Column({ nullable: false, name: "soluong" })
  @IsNumber()
  @Min(1)
  quantity: number;

  @Column({ nullable: false, name: "giaban" })
  @IsNumber()
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
