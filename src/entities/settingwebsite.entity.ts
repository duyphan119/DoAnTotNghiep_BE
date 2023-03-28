import { IsString } from "class-validator";
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity({ name: "caidattrangweb" })
class SettingWebsite {
  @PrimaryGeneratedColumn({ name: "madinhdanh" })
  id: number;

  @Column({ name: "tenthuoctinh" })
  @IsString({ message: "This field must be string" })
  key: string;

  @Column({ name: "giatri" })
  @IsString({ message: "This field must be string" })
  value: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

export default SettingWebsite;
