import { IsNumber, IsString, Min } from "class-validator";
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import CommentProduct from "./commentProduct.entity";
import FavoriteProduct from "./favoriteproduct.entity";
import GroupProduct from "./groupProduct.entity";
import ProductVariant from "./productVariant.entity";
import ProductVariantImage from "./productVarianImage.entity";

@Entity({ name: "mathang" })
class Product {
  @PrimaryGeneratedColumn({ name: "mahang" })
  id: number;

  @Column({ nullable: false, name: "tenhang" })
  @IsString({ message: "This field must be string" })
  name: string;

  @Column({ nullable: false, unique: true, name: "duongdan" })
  @IsString({ message: "This field must be string" })
  slug: string;

  @Column({ nullable: true, name: "hinhanh" })
  @IsString({ message: "This field must be string" })
  thumbnail: string;

  @Column({ nullable: true, name: "mota" })
  @IsString({ message: "This field must be string" })
  description: string;

  @Column({ nullable: true, name: "sao", default: 0, type: "float4" })
  star: number;

  @Column({ nullable: true, name: "chitiet", type: "text", select: false })
  detail: string;

  @Column({ default: 1, name: "manhomsanpham" })
  @IsString({ message: "This field must be string" })
  groupProductId: number;

  @OneToMany(() => ProductVariant, (e) => e.product)
  productVariants: ProductVariant[];

  @Column({ nullable: true, default: 0, name: "solongton" })
  @IsNumber(
    {},
    {
      message: "This field must be number",
    }
  )
  inventory: number;

  @Column({ nullable: false, name: "giaban" })
  @IsNumber(
    {},
    {
      message: "This field must be number",
    }
  )
  price: number;

  @CreateDateColumn({ name: "ngaytao" })
  createdAt: Date;

  @UpdateDateColumn({ name: "ngaycapnhat" })
  updatedAt: Date;

  @OneToMany(() => ProductVariantImage, (e) => e.product)
  images: ProductVariantImage[];

  // @OneToMany(() => OrderItem, (e) => e.product)
  // items: OrderItem[];

  @ManyToOne(() => GroupProduct, (e) => e.products)
  @JoinColumn({ name: "manhomsanpham", referencedColumnName: "id" })
  groupProduct: GroupProduct;

  @OneToMany(() => FavoriteProduct, (e) => e.product)
  favorites: FavoriteProduct[];

  @DeleteDateColumn({ name: "ngayxoa" })
  deletedAt?: Date;

  @OneToMany(() => CommentProduct, (e) => e.product)
  commentProducts: CommentProduct[];

  @Column({ nullable: true, name: "metatukhoa", default: "" })
  @IsString({ message: "This field must be string" })
  metaKeywords: string;

  @Column({ nullable: true, name: "metamota", default: "" })
  @IsString({ message: "This field must be string" })
  metaDescription: string;
}
export default Product;
