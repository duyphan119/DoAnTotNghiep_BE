import { IsNumber, IsString, Length } from "class-validator";
import {
  AfterUpdate,
  BaseEntity,
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
import OrderItem from "./orderitem.entity";
import User from "./user.entity";
import OrderDiscount from "./orderdiscount.entity";
import { AppDataSource } from "../data-source";
import UserAddress from "./useraddress.entity";
import userAddressService from "../services/useraddress.service";
import orderService from "../services/order.service";

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
@EventSubscriber()
export class OrderSubscriber implements EntitySubscriberInterface<Order> {
  listenTo() {
    return Order;
  }

  async afterInsert(event: InsertEvent<Order>): Promise<any> {
    const { district, province, address, ward, userId, fullName, phone } =
      event.entity;
    // Kiểm tra địa chỉ của khách hàng có trong sổ địa chỉ chưa
    // Nếu không có thì tạo mới
    const userAddress = await userAddressService.getByDTO(userId, {
      district,
      province,
      address,
      ward,
    });
    if (!userAddress) {
      return userAddressService.createUserAddress(userId, {
        district,
        province,
        address,
        ward,
      });
    }
  }

  async afterUpdate(event: UpdateEvent<Order>): Promise<any> {
    try {
      if (event.entity) {
        let { data: order } = await orderService.getOrderById(event.entity.id);
        console.log("NEW: ", event.entity);
        console.log("updatedColumns: ", event.updatedColumns);
        // new => event.entity
        // old => event.databaseEntity
        if (order) {
          // const { status: oldStatus } = event.databaseEntity;
          const {
            // status: newStatus,
            district,
            province,
            address,
            ward,
            userId,
          } = order;

          // Cập nhật số lượng tồn
          let promises: Promise<any>[] = [];
          // let downInventory =
          //   (!oldStatus || oldStatus === "Đang xử lý") &&
          //   newStatus &&
          //   newStatus !== "Đang xử lý"; // Đặt hàng -> giảm tồn kho
          // let upInventory =
          //   oldStatus &&
          //   oldStatus !== "Đang xử lý" &&
          //   (newStatus || newStatus === "Đang xử lý"); // Hủy đặt hàng -> tăng tồn kho

          // order.items.forEach((item: OrderItem) => {
          //   // Chi tiết đơn hàng có biến thể
          //   if (item.productVariant) {
          //     let inventory = item.productVariant.inventory;
          //     if (downInventory) {
          //       inventory -= item.quantity;
          //     } else if (upInventory) {
          //       inventory += item.quantity;
          //     }
          //     promises.push(
          //       ProductVariant.update(
          //         { id: item.productVariantId },
          //         { inventory: inventory }
          //       )
          //     );
          //   }
          //   // Chi tiết đơn hàng không có biến thể
          //   else {
          //     let inventory = item.product.inventory;
          //     if (downInventory) {
          //       inventory -= item.quantity;
          //     } else if (upInventory) {
          //       inventory += item.quantity;
          //     }
          //     promises.push(
          //       Product.update({ id: item.productId }, { inventory: inventory })
          //     );
          //   }
          // });

          // Kiểm tra địa chỉ của khách hàng có trong sổ địa chỉ chưa
          // Nếu không có thì tạo mới
          const userAddress = await userAddressService.getByDTO(userId, {
            district,
            province,
            address,
            ward,
          });
          if (!userAddress) {
            promises.push(
              userAddressService.createUserAddress(userId, {
                district,
                province,
                address,
                ward,
              })
            );
          }
          console.log("TRIGGER AFTER UPDATE EXECUTE");

          // Chạy promises
          return Promise.all(promises);
        }
      }
    } catch (error) {
      console.log("TRIGGER AFTER UPDATE ORDER ERROR", error);
    }
  }
}
