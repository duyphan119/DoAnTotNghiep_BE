import { IsNumber, IsString } from "class-validator";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity({ name: "baiviet" })
class Blog {
  @PrimaryGeneratedColumn({ name: "mabaiviet" })
  id: number;

  @Column({ name: "tieude", nullable: false })
  @IsString()
  title: string;

  @Column({ name: "bidanh", nullable: false })
  @IsString()
  slug: string;

  @Column({ name: "noidung", nullable: false, type: "text" })
  @IsString()
  content: string;

  @Column({ name: "matk", nullable: false })
  @IsNumber()
  userId: number;

  @Column({ name: "anhdaidien", nullable: true })
  @IsString()
  thumbnail?: string;

  @CreateDateColumn({ name: "ngaytao" })
  createdAt: Date;

  @UpdateDateColumn({ name: "ngaycapnhat" })
  updatedAt: Date;

  @DeleteDateColumn({ name: "ngayxoa" })
  deletedAt?: Date;
}
export default Blog;
