import { IsNumber, IsString } from "class-validator";
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity({ name: "sodiachi" })
class UserAddress {
  @PrimaryGeneratedColumn({ name: "masodiachi" })
  id: number;

  @Column({ nullable: false, name: "matk" })
  @IsNumber()
  userId: number;

  @Column({ nullable: true, name: "tinh" })
  @IsString()
  province: string;

  @Column({ nullable: true, name: "quan" })
  @IsString()
  district: string;

  @Column({ nullable: true, name: "phuong" })
  @IsString()
  ward: string;

  @Column({ nullable: true, name: "diachi" })
  @IsString()
  address: string;

  @CreateDateColumn({ name: "ngaytao" })
  createdAt: Date;

  @UpdateDateColumn({ name: "ngaycapnhat" })
  updatedAt: Date;
}
export default UserAddress;
