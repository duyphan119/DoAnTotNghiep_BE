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
  @IsString()
  key: string;

  @Column({ name: "giatri" })
  @IsString()
  value: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

export default SettingWebsite;
