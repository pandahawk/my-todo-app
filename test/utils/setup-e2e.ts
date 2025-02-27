import { INestApplication } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TestingModule, Test } from "@nestjs/testing";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TodosModule } from "@todos/todos.module";
import { DataSource } from "typeorm";

export async function setupE2E(): Promise<{ app: INestApplication; dataSource: DataSource }> {
    const module: TestingModule = await Test.createTestingModule({
        imports: [
          ConfigModule.forRoot({ envFilePath: '.env.test' }),
          TypeOrmModule.forRoot({
            type: 'postgres',
            host:
            process.env.NODE_ENV === 'docker' ? process.env.POSTGRES_HOST : 'localhost',
          port: 5433,
          username: process.env.POSTGRES_USER,
          password: process.env.POSTGRES_PASSWORD,
          database: process.env.POSTGRES_DB,
            autoLoadEntities: true,
            synchronize: true, // Auto-create tables (disable in production)
            dropSchema: true, // Drop schema before tests
          }),
          TodosModule,
        ],
      }).compile();
  
      const app = module.createNestApplication();
      await app.init();
  
      // Get the DataSource
     const dataSource = module.get<DataSource>(DataSource);

      if (!dataSource) throw new Error("DataSource is not defined!");
  
      if (!dataSource) throw new Error("DataSource is not defined!");
    
    if (!dataSource.isInitialized) {
        console.log('🔄 Initializing test database...');
        await dataSource.initialize();
        console.log('✅ Database initialized.');
    }
  
    return { app, dataSource };
  }
  