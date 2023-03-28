import { IsString } from "class-validator";
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity({ name: "quangcao" })
class Advertisement {
  @PrimaryGeneratedColumn({ name: "maquangcao" })
  id: number;

  @Column({ name: "tieude", default: "" })
  @IsString({ message: "This field must be string" })
  title: string;

  @Column({ default: "/", name: "lienket" })
  @IsString({ message: "This field must be string" })
  href: string;

  @Column({ name: "duongdan", nullable: false })
  @IsString({ message: "This field must be string" })
  path: string;

  @Column({ name: "trang", default: "Trang chủ" })
  @IsString({ message: "This field must be string" })
  page: string;

  @CreateDateColumn({ name: "ngaytao" })
  createdAt: Date;

  @UpdateDateColumn({ name: "ngaycapnhat" })
  updatedAt: Date;
}

export default Advertisement;
