import { IsString } from "class-validator";
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
import VariantValue from "./variantValue.entity";

@Entity({ name: "bienthe" })
class Variant {
  @PrimaryGeneratedColumn({ name: "mabt" })
  id: number;

  @Column({ nullable: false, unique: true, name: "tenbt" })
  @IsString()
  name: string;

  @CreateDateColumn({ name: "ngaytao" })
  createdAt: Date;

  @UpdateDateColumn({ name: "ngaycapnhat" })
  updatedAt: Date;

  @OneToMany(() => VariantValue, (e) => e.variant)
  variantValues: VariantValue[];

  @DeleteDateColumn({ name: "ngayxoa" })
  deletedAt?: Date;
}
export default Variant;
