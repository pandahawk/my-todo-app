import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSourceOptions } from 'typeorm';

const isDocker = process.env.NODE_ENV === 'docker';

export const dbConfigForApp = (): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: isDocker? process.env.POSTGRES_HOST: 'localhost',
  port: Number(process.env.POSTGRES_PORT),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: [__dirname + '/../src/entities/*.entity{.ts,.js}'],
  synchronize: false,
});

// For TypeORM CLI and migrations
export const dbConfigForDataSource = (): DataSourceOptions => ({
  ...(dbConfigForApp() as any), 
  migrations: [__dirname + '/../migrations/*{.ts,.js}'],
  migrationsRun: true,
});
