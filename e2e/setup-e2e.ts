import { INestApplication, Logger } from '@nestjs/common';
import { TestingModule, Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TodosModule } from '@todos/todos.module';
import { DataSource } from 'typeorm';
import { dbConfigForApp } from '../config/db.config';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.test' });
const logger = new Logger('setup-e2e');

export async function setupE2E(): Promise<{
  app: INestApplication;
  dataSource: DataSource;
}> {
  logger.log('function started executing!');
  const module: TestingModule = await Test.createTestingModule({
    imports: [
      TypeOrmModule.forRoot({
        ...dbConfigForApp(),
        autoLoadEntities: true,
        synchronize: true, // Auto-create tables (disable in production)
        dropSchema: true, // Drop schema before tests
      }),
      TodosModule,
    ],
  }).compile();

  logger.log('Test module compiled.');

  const app = module.createNestApplication();
  await app.init();

  logger.log('Nest app initialized.');
  // Get the DataSource
  const dataSource = module.get<DataSource>(DataSource);

  if (!dataSource) {
    logger.error('DataSource is not defined!');
    throw new Error('DataSource is not defined');
  }

  if (!dataSource.isInitialized) {
    logger.log('🔄 Initializing test database...');
    await dataSource.initialize();
    logger.log('✅ Database initialized.');
  }

  logger.log('Completed successfully.');
  return { app, dataSource };
}
