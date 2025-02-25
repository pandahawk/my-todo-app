import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
dotenv.config();

console.log(
  "process.env.NODE_ENV === 'docker' ? process.env.POSTGRES_HOST : 'localhost' = ",
  process.env.NODE_ENV === 'docker' ? process.env.POSTGRES_HOST : 'localhost',
);
export const AppDataSource = new DataSource({
  type: 'postgres',
  host:
  process.env.NODE_ENV === 'docker' ? process.env.POSTGRES_HOST : 'localhost',
  port: 5432,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: ['./src/entities/*{.ts,.js}'],
  migrations: ['./migrations/*{.ts,.js}'],
});
