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
  @IsNumber()
  userId: number;

  @Column({ name: "sao", default: 5, nullable: true })
  @IsNumber()
  @Min(1)
  @Max(5)
  star: number;

  @Column({ name: "noidung", nullable: false })
  @IsString()
  content: string;

  @Column({ name: "mahang", nullable: false })
  @IsNumber()
  productId: number;

  @Column({ name: "mabinhluan_traloi", nullable: true })
  @IsNumber()
  parentId: number;

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
