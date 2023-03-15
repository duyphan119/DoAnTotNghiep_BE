import { IsNumber, IsString } from "class-validator";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import ProductVariant from "./productVariant.entity";
import Variant from "./variant.entity";

@Entity({ name: "giatribienthe" })
class VariantValue {
  @PrimaryGeneratedColumn({ name: "magiatribienthe" })
  id: number;

  @Column({ nullable: false, unique: true, name: "giatri" })
  @IsString()
  value: string;

  @Column({ name: "mabt", default: 1 })
  @IsNumber()
  variantId: number;

  @CreateDateColumn({ name: "ngaytao" })
  createdAt: Date;

  @UpdateDateColumn({ name: "ngaycapnhat" })
  updatedAt: Date;

  @ManyToMany(() => ProductVariant, (e) => e.variantValues)
  @JoinTable({ name: "mathangbienthe_giatribienthe" })
  productVariants: ProductVariant[];

  @ManyToOne(() => Variant, (e) => e.variantValues)
  @JoinColumn({ name: "mabt", referencedColumnName: "id" })
  variant: Variant;

  @DeleteDateColumn({ name: "ngayxoa" })
  deletedAt?: Date;
}
export default VariantValue;
