import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TodosModule } from './todos/todos.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { dbConfigForApp } from '../config/db.config';
import { MetricsMiddleware } from 'metrics/metrics.middleware';
import { MetricsController } from 'metrics/metrics.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env' }),
    TypeOrmModule.forRoot(dbConfigForApp()),
    TodosModule,
  ],
  exports: [TypeOrmModule],
  providers: [],
  controllers: [MetricsController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(MetricsMiddleware).forRoutes('*');
  }
}
