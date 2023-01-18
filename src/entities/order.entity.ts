import { IsNumber, IsString, Length } from "class-validator";
import {
  Column,
  CreateDateColumn,
  Entity,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  UpdateEvent,
} from "typeorm";
import orderService from "../services/order.service";
import userAddressService from "../services/useraddress.service";
import OrderDiscount from "./orderdiscount.entity";
import OrderItem from "./orderitem.entity";
import User from "./user.entity";

@Entity({ name: "donhang" })
class Order {
  @PrimaryGeneratedColumn({ name: "madonhang" })
  id: number;

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

  @Column({ nullable: true, name: "trangthaidonhang" })
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
}
export default Order;
