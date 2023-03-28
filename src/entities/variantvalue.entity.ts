import { IsBoolean, IsNumber, IsString } from "class-validator";
import {
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

@Entity({ name: "thuoctinhsanpham" })
class VariantValue {
  @PrimaryGeneratedColumn({ name: "madinhdanh" })
  id: number;

  @Column({ nullable: false, unique: true, name: "giatri" })
  @IsString({
    message: "This field must be string",
  })
  value: string;

  @Column({ nullable: false, unique: true, name: "mathuoctinh" })
  @IsString({
    message: "This field must be string",
  })
  code: string;

  @Column({ nullable: true, default: true, name: "cohinhanh" })
  @IsBoolean({
    message: "This field must be boolean",
  })
  hasThumbnail: boolean;

  @Column({ name: "madinhdanhloaithuoctinh", default: 1 })
  @IsNumber({}, { message: "This field must be number" })
  variantId: number;

  @CreateDateColumn({ name: "ngaytao" })
  createdAt: Date;

  @UpdateDateColumn({ name: "ngaycapnhat" })
  updatedAt: Date;

  @ManyToMany(() => ProductVariant, (e) => e.variantValues)
  @JoinTable({ name: "mathangbienthe_thuoctinhsanpham" })
  productVariants: ProductVariant[];

  @ManyToOne(() => Variant, (e) => e.variantValues)
  @JoinColumn({ name: "madinhdanhloaithuoctinh", referencedColumnName: "id" })
  variant: Variant;

  @DeleteDateColumn({ name: "ngayxoa" })
  deletedAt?: Date;
}
export default VariantValue;
