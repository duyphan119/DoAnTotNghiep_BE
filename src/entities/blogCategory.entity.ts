import { IsString } from "class-validator";
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import Blog from "./blog.entity";

@Entity({ name: "danhmucbaiviet" })
class BlogCategory {
  @PrimaryGeneratedColumn({ name: "madanhmucbaiviet" })
  id: number;

  @Column({ name: "tendanhmuc", unique: true, nullable: false })
  @IsString({ message: "This field must be string" })
  name: string;

  @Column({ name: "bidanh", unique: true, nullable: false })
  @IsString({ message: "This field must be string" })
  slug: string;

  @Column({ name: "mota" })
  @IsString({ message: "This field must be string" })
  description: string;

  @CreateDateColumn({ name: "ngaytao" })
  createdAt: Date;

  @UpdateDateColumn({ name: "ngaycapnhat" })
  updatedAt: Date;

  @DeleteDateColumn({ name: "ngayxoa" })
  deletedAt?: Date;

  @OneToMany(() => Blog, (e) => e.blogCategory)
  blogs: Blog[];
}

export default BlogCategory;
