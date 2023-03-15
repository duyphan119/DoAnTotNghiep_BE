import { IsNumber, IsString, Max, Min } from "class-validator";
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Tree,
  TreeChildren,
  TreeParent,
  UpdateDateColumn,
} from "typeorm";
import CommentProduct from "./commentProduct.entity";
import User from "./user.entity";

@Entity({ name: "phanhoibinhluanmathang" })
class RepCommentProduct {
  @PrimaryGeneratedColumn({ name: "maphanhoibinhluan" })
  id: number;

  @Column({ name: "matk", nullable: false })
  @IsNumber()
  userId: number;

  @Column({ name: "noidung", nullable: false })
  @IsString()
  content: string;

  @Column({ name: "mabinhluan" })
  @IsNumber()
  commentProductId: number;

  @ManyToOne(() => CommentProduct, (e) => e.repComments)
  @JoinColumn({ name: "mabinhluan", referencedColumnName: "id" })
  commentProduct: CommentProduct;

  @ManyToOne(() => User, (e) => e.commentProducts)
  @JoinColumn({ name: "matk", referencedColumnName: "id" })
  user: User;

  @CreateDateColumn({ name: "ngaytao" })
  createdAt: Date;

  @UpdateDateColumn({ name: "ngaycapnhat" })
  updatedAt: Date;

  @DeleteDateColumn({ name: "ngayxoa" })
  deletedAt?: Date;
}

export default RepCommentProduct;
