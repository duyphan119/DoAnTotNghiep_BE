import { IsNumber, IsString } from "class-validator";
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import Notification from "./notification.entity";

@Entity({ name: "loaithongbao" })
class NotificationType {
  @PrimaryGeneratedColumn({ name: "maloaithongbao" })
  id: number;

  @Column({ name: "tenloaithongbao", nullable: false })
  @IsString()
  name: string;

  @Column({ name: "hinhanh", nullable: true, default: "" })
  @IsString()
  icon: string;

  @CreateDateColumn({ name: "ngaytao" })
  createdAt: Date;

  @UpdateDateColumn({ name: "ngaycapnhat" })
  updatedAt: Date;

  @DeleteDateColumn({ name: "ngayxoa" })
  deletedAt?: Date;

  @OneToMany(() => Notification, (e) => e.notificationType)
  notifications: Notification[];
}

export default NotificationType;
