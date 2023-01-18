import { IsNumber, IsString } from "class-validator";
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

export enum NotifyTypeEnum {
  Order = "Đơn hàng",
  CommentProduct = "Đánh giá sản phẩm",
  RepCommentProduct = "Trả lời đánh giá sản phẩm",
}

@Entity({ name: "thongbao" })
class Notify {
  @PrimaryGeneratedColumn({ name: "mathongbao" })
  id: number;

  @Column({ name: "tinnhan", nullable: false })
  @IsString()
  message: string;

  @Column({ name: "matk", nullable: false })
  @IsNumber()
  userId: number;

  @Column({ name: "ngaydoc", nullable: true })
  readAt: Date;

  @Column({ name: "matk_dadoc", nullable: true })
  readBy: number;

  @Column({
    name: "loaithongbao",
    type: "enum",
    enum: NotifyTypeEnum,
    default: NotifyTypeEnum.Order,
  })
  type: string;

  @CreateDateColumn({ name: "ngaytao" })
  createdAt: Date;

  @UpdateDateColumn({ name: "ngaycapnhat" })
  updatedAt: Date;
}

export default Notify;
