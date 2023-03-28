import {
  IsBoolean,
  IsEmail,
  IsString,
  Length,
  MinLength,
} from "class-validator";
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import CommentProduct from "./commentProduct.entity";
import Order from "./order.entity";

@Entity({ name: "taikhoan" })
class User {
  @PrimaryGeneratedColumn({ name: "matk" })
  id: number;

  @Column({ nullable: false, name: "hoten" })
  @IsString({
    message: "This field must be string",
  })
  fullName: string;

  @Column({ nullable: false, unique: true, name: "email" })
  @IsEmail(
    {},
    {
      message: "This field is invalid",
    }
  )
  email: string;

  @Column({ nullable: false, name: "matkhau", select: false })
  @MinLength(6, {
    message: "This field must have least 6 characters",
  })
  @IsString({
    message: "This field must be string",
  })
  password: string;

  @Column({ nullable: false, unique: true, length: 10, name: "sdt" })
  @Length(10, 10, {
    message: "This field must have 10 digits",
  })
  @IsString({
    message: "This field must be string",
  })
  phone: string;

  @Column({ default: 0, name: "diem" })
  point: number;

  @Column({ default: false, name: "quyen" })
  @IsBoolean()
  isAdmin: boolean;

  @CreateDateColumn({ name: "ngaytao" })
  createdAt: Date;

  @UpdateDateColumn({ name: "ngaycapnhat" })
  updatedAt: Date;

  @DeleteDateColumn({ name: "ngayxoa" })
  deletedAt?: Date;

  @OneToMany(() => Order, (e) => e.user)
  orders: Order[];

  @OneToMany(() => CommentProduct, (e) => e.user)
  commentProducts: CommentProduct[];
}
export default User;
