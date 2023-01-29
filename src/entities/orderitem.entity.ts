import { IsNumber, Min } from "class-validator";
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import Order from "./order.entity";
import ProductVariant from "./productvariant.entity";

@Entity({ name: "chitietdonhang" })
class OrderItem {
  @PrimaryGeneratedColumn({ name: "machitietdonhang" })
  id: number;

  @Column({ nullable: false, name: "madonhang" })
  @IsNumber()
  orderId: number;

  // @Column({ nullable: false, name: "mahang" })
  // @IsNumber()
  // productId: number;

  @Column({ nullable: true, name: "mahangbienthe" })
  @IsNumber()
  productVariantId: number;

  @Column({ nullable: false, name: "soluong" })
  @IsNumber()
  @Min(1)
  quantity: number;

  @Column({ nullable: false, name: "giaban" })
  @IsNumber()
  price: number;

  @CreateDateColumn({ name: "ngaytao" })
  createdAt: Date;

  @UpdateDateColumn({ name: "ngaycapnhat" })
  updatedAt: Date;

  // @ManyToOne(() => Product, (e) => e.items)
  // @JoinColumn({ name: "mahang", referencedColumnName: "id" })
  // product: Product;

  @ManyToOne(() => ProductVariant, (e) => e.items)
  @JoinColumn({ name: "mahangbienthe", referencedColumnName: "id" })
  productVariant: ProductVariant;

  @ManyToOne(() => Order, (e) => e.items)
  @JoinColumn({ name: "madonhang", referencedColumnName: "id" })
  order: Order;
}
export default OrderItem;
// @EventSubscriber()
// export class OrderItemSubscriber
//   implements EntitySubscriberInterface<OrderItem>
// {
//   listenTo() {
//     return OrderItem;
//   }

//   async beforeInsert(event: InsertEvent<OrderItem>): Promise<any> {
//     try {
//       // if(!event.entity.orderId) {
//       //   event.entity.orderId = await Order.create().id
//       // }
//       const existingOrderItem = await OrderItem.findOne({
//         where: {
//           productId: event.entity.productId,
//           productVariantId: event.entity.productVariantId,
//           orderId: event.entity.orderId,
//         },
//         relations: { product: true },
//       });
//       if (existingOrderItem) {
//         event.entity.id = existingOrderItem.id;
//         event.entity.createdAt = existingOrderItem.createdAt;
//         event.entity.updatedAt = existingOrderItem.updatedAt;
//         event.entity.quantity += existingOrderItem.quantity;
//         event.entity.price = existingOrderItem.productVariant
//           ? existingOrderItem.productVariant.price
//           : existingOrderItem.product
//           ? existingOrderItem.product.price
//           : 0;
//         event.entity.updatedAt = new Date();
//         await OrderItem.delete({
//           id: existingOrderItem.id,
//         });
//       } else {
//         if (event.entity.productVariantId) {
//           const productVariant = await ProductVariant.findOneBy({
//             id: event.entity.productVariantId,
//           });
//           if (productVariant) event.entity.price = productVariant.price;
//         } else {
//           const product = await Product.findOneBy({
//             id: event.entity.productId,
//           });
//           if (product) event.entity.price = product.price;
//         }
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   }
// }
