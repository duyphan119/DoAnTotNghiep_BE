import { IsNumber, IsString } from "class-validator";
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import NotificationType from "./notificationType.entity";

@Entity({ name: "thongbao" })
class Notification {
  @PrimaryGeneratedColumn({ name: "mathongbao" })
  id: number;

  @Column({ name: "noidung", nullable: false })
  @IsString({ message: "This field must be string" })
  content: string;

  @Column({ name: "matk", nullable: false })
  @IsNumber(
    {},
    {
      message: "This field must be number",
    }
  )
  userId: number;

  @Column({ name: "ngaydoc", nullable: true })
  readAt: Date;

  @Column({ name: "matk_dadoc", nullable: true })
  readBy: number;

  @Column({ name: "maloaithongbao", nullable: true, default: 1 })
  notificationTypeId: number;

  @CreateDateColumn({ name: "ngaytao" })
  createdAt: Date;

  @UpdateDateColumn({ name: "ngaycapnhat" })
  updatedAt: Date;

  @DeleteDateColumn({ name: "ngayxoa" })
  deletedAt?: Date;

  @ManyToOne(() => NotificationType, (e) => e.notifications)
  @JoinColumn({ name: "maloaithongbao", referencedColumnName: "id" })
  notificationType: NotificationType;
}

export default Notification;
