import { IsNumber, IsString } from "class-validator";
import productService from "../services/product.service";
import productVariantService from "../services/productVariant.service";
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  UpdateEvent,
} from "typeorm";
import OrderItem from "./orderItem.entity";
import Product from "./product.entity";
import VariantValue from "./variantValue.entity";

@Entity({ name: "mathangbienthe" })
class ProductVariant {
  @PrimaryGeneratedColumn({ name: "madinhdanh" })
  id: number;

  @Column({ nullable: true, name: "tenhangbienthe" })
  @IsString()
  name: string;

  @Column({ nullable: false, name: "mamathangbienthe", unique: true })
  @IsString()
  code: string;

  @Column({ default: 0, name: "soluongton" })
  @IsNumber()
  inventory: number;

  @Column({ nullable: false, name: "giaban" })
  @IsNumber()
  price: number;

  @Column({ nullable: false, name: "mahang" })
  @IsNumber()
  productId: number;

  @CreateDateColumn({ name: "ngaytao" })
  createdAt: Date;

  @UpdateDateColumn({ name: "ngaycapnhat" })
  updatedAt: Date;

  @ManyToMany(() => VariantValue, (e) => e.productVariants)
  @JoinTable({ name: "mathangbienthe_thuoctinhsanpham" })
  variantValues: VariantValue[];

  @ManyToOne(() => Product, (e) => e.productVariants)
  @JoinColumn({ name: "mahang", referencedColumnName: "id" })
  product: Product;

  @OneToMany(() => OrderItem, (e) => e.order)
  items: OrderItem[];

  @DeleteDateColumn({ name: "ngayxoa" })
  deletedAt?: Date;
}
export default ProductVariant;
@EventSubscriber()
export class ProductVariantSubscriber
  implements EntitySubscriberInterface<ProductVariant>
{
  listenTo() {
    return ProductVariant;
  }

  afterInsert(event: InsertEvent<ProductVariant>): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const productId = event.entity.productId;
        const totalInventory = await productVariantService.totalInventory(
          productId
        );
        resolve(
          productService.updateOne(productId, { inventory: totalInventory })
        );
      } catch (error) {
        reject(error);
      }
    });
  }

  afterUpdate(event: UpdateEvent<ProductVariant>): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        if (event.entity) {
          const { productId } = event.entity;
          if (productId) {
            const totalInventory = await productVariantService.totalInventory(
              productId
            );
            resolve(
              productService.updateOne(productId, {
                inventory: totalInventory,
              })
            );
          }
        }
      } catch (error) {
        reject(error);
      }
    });
  }
}
