import { IsNumber, IsString } from "class-validator";
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import Product from "./product.entity";

@Entity({ name: "hinhanhmathangbienthe" })
class ProductVariantImage {
  @PrimaryGeneratedColumn({ name: "mahinhanhmathangbienthe" })
  id: number;

  @Column({ nullable: true, name: "duongdan" })
  @IsString()
  path: string;

  @Column({ name: "mahang" })
  @IsNumber()
  productId: number;

  @Column({ name: "magiatribienthe", nullable: true })
  variantValueId: number;

  @ManyToOne(() => Product, (e) => e.images)
  @JoinColumn({ name: "mahang", referencedColumnName: "id" })
  product: Product;

  @CreateDateColumn({ name: "ngaytao" })
  createdAt: Date;

  @UpdateDateColumn({ name: "ngaycapnhat" })
  updatedAt: Date;
}
export default ProductVariantImage;
