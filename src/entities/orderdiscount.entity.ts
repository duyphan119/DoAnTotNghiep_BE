import { IsDate, IsNumber, IsString, Min, MinLength } from "class-validator";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import Order from "./order.entity";

@Entity({ name: "giamgiadonhang" })
class OrderDiscount {
  @PrimaryGeneratedColumn({ name: "madinhdanh" })
  id: number;

  @Column({ name: "magiamgia", nullable: false, length: 6 })
  @MinLength(6, {
    message: "This field must be least 6 characters",
  })
  @IsString({ message: "This field must be string" })
  code: string;

  @Column({ name: "batdau", default: new Date() })
  @IsDate({
    message: "This field must be date",
  })
  start: Date;

  @Column({ name: "ketthuc", nullable: false })
  @IsDate({
    message: "This field must be date",
  })
  end: Date;

  @Column({ name: "giatoithieu", default: 0 })
  @Min(0, {
    message: "This field must be great than or equal 0",
  })
  @IsNumber(
    {},
    {
      message: "This field must be number",
    }
  )
  minPrice: number;

  @Column({ name: "giatri", nullable: false })
  @IsNumber(
    {},
    {
      message: "This field must be number",
    }
  )
  @Min(0, {
    message: "This field must be great than or equal 0",
  })
  value: number;

  @CreateDateColumn({ name: "ngaytao" })
  createdAt: Date;

  @UpdateDateColumn({ name: "ngaycapnhat" })
  updatedAt: Date;

  @DeleteDateColumn({ name: "ngayxoa" })
  deletedAt?: Date;

  @OneToMany(() => Order, (e) => e.discount)
  orders: Order[];
}
export default OrderDiscount;
