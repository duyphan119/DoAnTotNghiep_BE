import { IsBoolean, IsEmail, IsNumber, IsString, Min } from "class-validator";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import CommentProduct from "./commentproduct.entity";
import Order from "./order.entity";

@Entity({ name: "taikhoan" })
class User {
  @PrimaryGeneratedColumn({ name: "matk" })
  id: number;

  @Column({ nullable: false, name: "hoten" })
  @IsString()
  fullName: string;

  @Column({ nullable: false, unique: true, name: "email" })
  @IsEmail()
  email: string;

  @Column({ nullable: false, name: "matkhau" })
  @IsString()
  password: string;

  @Column({ nullable: false, length: 10, name: "sdt" })
  @IsString()
  phone: string;

  @Column({ default: 0, name: "diem" })
  @IsNumber()
  @Min(0)
  point: number;

  @Column({ default: false, name: "quyen" })
  @IsBoolean()
  isAdmin: boolean;

  @CreateDateColumn({ name: "ngaytao" })
  createdAt: Date;

  @UpdateDateColumn({ name: "ngaycapnhat" })
  updatedAt: Date;

  @OneToMany(() => Order, (e) => e.user)
  orders: Order[];

  @OneToMany(() => CommentProduct, (e) => e.user)
  commentProducts: CommentProduct[];
}
export default User;
