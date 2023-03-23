import {
  IsBoolean,
  IsDate,
  IsNumber,
  IsString,
  Length,
  Min,
} from "class-validator";
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import OrderDiscount from "./orderDiscount.entity";
import OrderItem from "./orderItem.entity";
import User from "./user.entity";

export enum OrderStatusEnum {
  PENDING = "Đang xử lý",
  DELIVERING = "Đang giao hàng",
  CANCELED = "Đã hủy",
  DELIVERED = "Đã giao",
  INCART = "Giỏ hàng",
}

@Entity({ name: "donhang" })
class Order {
  @PrimaryGeneratedColumn({ name: "madinhdanh" })
  id: number;

  @Column({ nullable: true, name: "madonhang" })
  @IsString()
  code: string;

  @Column({ nullable: true, name: "hoten" })
  @IsString()
  fullName: string;

  @Column({ nullable: true, length: 10, name: "sodienthoai" })
  @IsString()
  @Length(10)
  phone: string;

  @Column({ nullable: true, name: "tinh" })
  @IsString()
  province: string;

  @Column({ nullable: true, name: "quan" })
  @IsString()
  district: string;

  @Column({ nullable: true, name: "phuong" })
  @IsString()
  ward: string;

  @Column({ nullable: true, name: "diachi" })
  @IsString()
  address: string;

  @Column({
    nullable: true,
    name: "trangthaidonhang",
    type: "enum",
    enum: OrderStatusEnum,
    default: OrderStatusEnum.INCART,
  })
  @IsString()
  status: string;

  @Column({ default: 0, name: "tienvanchuyen" })
  @IsNumber()
  shippingPrice: number;

  @Column({
    default: "Thanh toán khi nhận hàng (COD)",
    name: "phuongthucthanhtoan",
  })
  @IsString()
  paymentMethod: string;

  @Column({ nullable: true, name: "ghichu" })
  @IsString()
  note: string;

  @Column({ nullable: true, name: "diem", default: 0 })
  @IsNumber()
  @Min(0)
  point: number;

  @Column({ nullable: true, default: false, name: "dadathang" })
  @IsBoolean()
  isOrdered: boolean;

  @Column({ nullable: true, default: true, name: "chophephuy" })
  @IsBoolean()
  allowCannceled: boolean;

  @Column({ nullable: true, default: false, name: "dathanhtoan" })
  @IsBoolean()
  isPaid: boolean;

  @Column({ nullable: true, name: "ngaydat" })
  @IsDate()
  orderDate: Date;

  @Column({ nullable: false, name: "matk" })
  @IsNumber()
  userId: number;

  @CreateDateColumn({ name: "ngaytao" })
  createdAt: Date;

  @UpdateDateColumn({ name: "ngaycapnhat" })
  updatedAt: Date;

  @ManyToOne(() => User, (e) => e.orders)
  @JoinColumn({ name: "matk", referencedColumnName: "id" })
  user: User;

  @OneToMany(() => OrderItem, (e) => e.order)
  items: OrderItem[];

  @ManyToOne(() => OrderDiscount, (e) => e.orders)
  @JoinColumn({ name: "madinhdanh_giamgia", referencedColumnName: "id" })
  discount: OrderDiscount;

  @Column({ name: "madinhdanh_giamgia", nullable: true })
  @IsNumber()
  discountId: number;

  @DeleteDateColumn({ name: "ngayxoa" })
  deletedAt?: Date;
}
export default Order;
