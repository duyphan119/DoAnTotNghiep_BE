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
  @IsString()
  name: string;

  @Column({ nullable: false, unique: true, name: "duongdan" })
  @IsString()
  slug: string;

  @Column({ nullable: true, name: "hinhanh" })
  @IsString()
  thumbnail: string;

  @Column({ nullable: true, name: "mota" })
  @IsString()
  description: string;

  @Column({ nullable: true, name: "sao", default: 0, type: "float4" })
  star: number;

  @Column({ nullable: true, name: "chitiet", type: "text" })
  detail: string;

  @Column({ default: 1, name: "manhomsanpham" })
  @IsString()
  groupProductId: number;

  @OneToMany(() => ProductVariant, (e) => e.product)
  productVariants: ProductVariant[];

  @Column({ nullable: true, default: 0, name: "solongton" })
  @IsNumber()
  inventory: number;

  @Column({ nullable: false, name: "giaban" })
  @IsNumber()
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
}
export default Product;
