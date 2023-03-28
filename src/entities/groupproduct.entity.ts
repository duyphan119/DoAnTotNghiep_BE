import { IsBoolean, IsNumber, IsString, Length } from "class-validator";
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
import Product from "./product.entity";
// import { Product } from "./product.entity";
export enum GroupProductSexEnum {
  MALE = "Nam",
  FEMALE = "Nữ",
  UNISEX = "Unisex",
}

@Entity({ name: "nhomsanpham" })
class GroupProduct {
  @PrimaryGeneratedColumn({ name: "manhomsanpham" })
  id: number;

  @Column({ nullable: false, name: "tennhomsanpham" })
  @IsString({ message: "This field must be string" })
  name: string;

  @Column({ nullable: false, name: "duongdan" })
  @IsString({ message: "This field must be string" })
  slug: string;

  @Column({ nullable: true, name: "hinhanh" })
  @IsString({ message: "This field must be string" })
  thumbnail: string;

  @Column({
    nullable: true,
    name: "gioitinh",
    type: "enum",
    enum: GroupProductSexEnum,
    default: GroupProductSexEnum.MALE,
  })
  @IsString({ message: "This field must be string" })
  sex: string;

  @Column({ name: "nguoilon", default: true })
  @IsBoolean()
  isAdult: boolean;

  @Column({ nullable: true, name: "mota" })
  @IsString({ message: "This field must be string" })
  description: string;

  @OneToMany(() => Product, (e) => e.groupProduct)
  products: Product[];

  @Column({ nullable: true, name: "metatukhoa", default: "" })
  @IsString({ message: "This field must be string" })
  metaKeywords: string;

  @Column({ nullable: true, name: "metamota", default: "" })
  @IsString({ message: "This field must be string" })
  metaDescription: string;

  @CreateDateColumn({ name: "ngaytao" })
  createdAt: Date;

  @UpdateDateColumn({ name: "ngaycapnhat" })
  updatedAt: Date;

  @DeleteDateColumn({ name: "ngayxoa" })
  deletedAt?: Date;
}
export default GroupProduct;
