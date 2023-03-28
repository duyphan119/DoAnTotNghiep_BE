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
  @IsNumber(
    {},
    {
      message: "This field must be number",
    }
  )
  userId: number;

  @Column({ nullable: true, name: "tinh" })
  @IsString({ message: "This field must be string" })
  province: string;

  @Column({ nullable: true, name: "quan" })
  @IsString({ message: "This field must be string" })
  district: string;

  @Column({ nullable: true, name: "phuong" })
  @IsString({ message: "This field must be string" })
  ward: string;

  @Column({ nullable: true, name: "diachi" })
  @IsString({ message: "This field must be string" })
  address: string;

  @CreateDateColumn({ name: "ngaytao" })
  createdAt: Date;

  @UpdateDateColumn({ name: "ngaycapnhat" })
  updatedAt: Date;
}
export default UserAddress;
