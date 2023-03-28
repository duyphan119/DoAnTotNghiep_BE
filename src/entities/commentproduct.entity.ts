import { IsNumber, IsString, Max, Min } from "class-validator";
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import Product from "./product.entity";
import RepCommentProduct from "./repCommentProduct.entity";
import User from "./user.entity";

@Entity({ name: "binhluanmathang" })
class CommentProduct {
  @PrimaryGeneratedColumn({ name: "mabinhluan" })
  id: number;

  @Column({ name: "matk", nullable: false })
  @IsNumber(
    {},
    {
      message: "This field must be number",
    }
  )
  userId: number;

  @Column({ name: "sao", default: 5, nullable: true })
  @IsNumber(
    {},
    {
      message: "This field must be number",
    }
  )
  @Min(1, {
    message: "This field must be greater than or equal 1",
  })
  @Max(5, {
    message: "This field must be less than or equal 5",
  })
  star: number;

  @Column({ name: "noidung", nullable: false })
  @IsString({ message: "This field must be string" })
  content: string;

  @Column({ name: "mahang", nullable: false })
  @IsNumber(
    {},
    {
      message: "This field must be number",
    }
  )
  productId: number;

  @ManyToOne(() => User, (e) => e.commentProducts)
  @JoinColumn({ name: "matk", referencedColumnName: "id" })
  user: User;

  @ManyToOne(() => Product, (e) => e.commentProducts)
  @JoinColumn({ name: "mahang", referencedColumnName: "id" })
  product: Product;

  @OneToMany(() => RepCommentProduct, (e) => e.commentProduct)
  repComments: RepCommentProduct[];

  @CreateDateColumn({ name: "ngaytao" })
  createdAt: Date;

  @UpdateDateColumn({ name: "ngaycapnhat" })
  updatedAt: Date;
}

export default CommentProduct;
