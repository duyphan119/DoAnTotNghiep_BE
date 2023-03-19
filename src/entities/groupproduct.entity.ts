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
  @IsString()
  name: string;

  @Column({ nullable: false, name: "duongdan" })
  @IsString()
  slug: string;

  @Column({ nullable: true, name: "hinhanh" })
  @IsString()
  thumbnail: string;

  @Column({
    nullable: true,
    name: "gioitinh",
    type: "enum",
    enum: GroupProductSexEnum,
    default: GroupProductSexEnum.MALE,
  })
  @IsString()
  sex: string;

  @Column({ name: "nguoilon", default: true })
  @IsBoolean()
  isAdult: boolean;

  @Column({ nullable: true, name: "mota" })
  @IsString()
  description: string;

  @OneToMany(() => Product, (e) => e.groupProduct)
  products: Product[];

  @Column({ nullable: true, name: "metatukhoa", default: "" })
  @IsString()
  metaKeywords: string;

  @Column({ nullable: true, name: "metamota", default: "" })
  @IsString()
  metaDescription: string;

  @CreateDateColumn({ name: "ngaytao" })
  createdAt: Date;

  @UpdateDateColumn({ name: "ngaycapnhat" })
  updatedAt: Date;

  @DeleteDateColumn({ name: "ngayxoa" })
  deletedAt?: Date;
}
export default GroupProduct;
