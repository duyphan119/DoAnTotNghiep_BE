import { IsNumber, IsString } from "class-validator";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import BlogCategory from "./blogCategory.entity";

@Entity({ name: "baiviet" })
class Blog {
  @PrimaryGeneratedColumn({ name: "mabaiviet" })
  id: number;

  @Column({ name: "modaubaiviet", nullable: true })
  @IsString({ message: "This field must be string" })
  heading: string;

  @Column({ name: "tieude", nullable: false })
  @IsString({ message: "This field must be string" })
  title: string;

  @Column({ name: "bidanh", nullable: false })
  @IsString({ message: "This field must be string" })
  slug: string;

  @Column({ name: "noidung", nullable: false, type: "text" })
  @IsString({ message: "This field must be string" })
  content: string;

  @Column({ name: "matk", nullable: false })
  @IsNumber(
    {},
    {
      message: "This field must be number",
    }
  )
  userId: number;

  @Column({ name: "anhdaidien", nullable: true })
  @IsString({ message: "This field must be string" })
  thumbnail?: string;

  @Column({ name: "madanhmucbaiviet", nullable: true })
  @IsNumber(
    {},
    {
      message: "This field must be number",
    }
  )
  blogCategoryId: number;

  @CreateDateColumn({ name: "ngaytao" })
  createdAt: Date;

  @UpdateDateColumn({ name: "ngaycapnhat" })
  updatedAt: Date;

  @DeleteDateColumn({ name: "ngayxoa" })
  deletedAt?: Date;

  @ManyToOne(() => BlogCategory, (e) => e.blogs)
  @JoinColumn({ name: "madanhmucbaiviet", referencedColumnName: "id" })
  blogCategory: BlogCategory;

  @Column({ nullable: true, name: "metatukhoa", default: "" })
  @IsString({ message: "This field must be string" })
  metaKeywords: string;

  @Column({ nullable: true, name: "metamota", default: "" })
  @IsString({ message: "This field must be string" })
  metaDescription: string;
}

/**
 * @swagger
 * components:
 *  schemas:
 *    Blog:
 *      type: object
 *      properties:
 *        id:
 *          type: integer
 *          example: 1
 *        title:
 *          type: string
 *          example: Outgoing president of Micronesia accuses China of bribery, threats and interference
 *        heading:
 *          type: string
 *          example: In his letter, Panuelo openly canvassed the country switching its diplomatic recognition from Beijing to Taipei
 *        slug:
 *          type: string
 *          example: outgoing-president-of-micronesia-accuses-china-of-bribery-threats-and-interference
 *        content:
 *          type: string
 *          example: <p>China is engaged in “political warfare” in the Pacific, the outgoing president of the Federated States of Micronesia has alleged in an excoriating letter, accusing Beijing officials of bribing elected officials in Micronesia, and even “direct threats against my personal safety”.</p>
 *        thumbnail:
 *          type: string
 *          example: https://i.guim.co.uk/img/media/f60b4e951b0272578a08df263d6927054422d94a/212_211_3585_2151/master/3585.jpg?width=620&quality=45&dpr=2&s=none
 *        blogCategoryId:
 *          type: integer
 *        userId:
 *          type: integer
 */

export default Blog;
