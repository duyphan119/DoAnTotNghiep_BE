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
  @IsString()
  title: string;

  @Column({ default: "/", name: "lienket" })
  @IsString()
  href: string;

  @Column({ name: "duongdan", nullable: false })
  @IsString()
  path: string;

  @Column({ name: "trang", default: "Trang chủ" })
  @IsString()
  page: string;

  @CreateDateColumn({ name: "ngaytao" })
  createdAt: Date;

  @UpdateDateColumn({ name: "ngaycapnhat" })
  updatedAt: Date;
}

export default Advertisement;
