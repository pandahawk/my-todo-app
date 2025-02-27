import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
dotenv.config();

// console.log('Connecting to database with:', {
//   host: process.env.POSTGRES_HOST,
//   user: process.env.POSTGRES_USER,
//   password: process.env.POSTGRES_PASSWORD,
//   database: process.env.POSTGRES_DB,
// });

const isDocker = process.env.NODE_ENV === 'docker';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: isDocker ? process.env.POSTGRES_HOST : 'localhost',
  port: isDocker ? Number(process.env.POSTGRES_PORT) : 5433, 
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: [__dirname +'./src/entities/*{.ts,.js}'],
  migrations: [__dirname +'./migrations/*{.ts,.js}'],
});
