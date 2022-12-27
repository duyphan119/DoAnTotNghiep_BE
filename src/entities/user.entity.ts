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
}
export default User;
// @EventSubscriber()
// export class UserSubscriber implements EntitySubscriberInterface<User> {
// 	listenTo() {
// 		return User;
// 	}

// 	async afterInsert(event: InsertEvent<User>) {
// 		try {
// 			if (!event.entity.isAdmin) {
// 				const cartRepository = event.manager.getRepository(Cart);
// 				const userRepository = event.manager.getRepository(User);
// 				const cart = new Cart();
// 				cart.userId = event.entity.id;
// 				await cartRepository.save(cart);
// 				event.entity.cart = cart;
// 				await userRepository.save(event.entity);
// 			}
// 		} catch (error) {}
// 	}
// }
