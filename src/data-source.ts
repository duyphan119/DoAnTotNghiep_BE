import path from "path";
import "reflect-metadata";
import { DataSource } from "typeorm";
import { __prod__ } from "./constants";
import { OrderSubscriber } from "./entities/order.entity";
import { ProductVariantSubscriber } from "./entities/productvariant.entity";
export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  ...(__prod__
    ? {
        url: process.env.DATABASE_URL,
        extra: {
          ssl: {
            rejectUnauthorized: false,
          },
        },
        ssl: true,
      }
    : {
        username: process.env.DB_USERNAME_DEV || "postgres",
        password: process.env.DB_PASSWORD_DEV || "duychomap710",
        database: "DoAnTotNghiep",
        synchronize: true,
      }),
  logging: true,
  entities: [path.join(__dirname, "/entities/*")],
  subscribers: [OrderSubscriber, ProductVariantSubscriber],
  migrations: [path.join(__dirname, "/migrations/*")],
});
