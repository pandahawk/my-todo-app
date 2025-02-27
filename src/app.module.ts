import { Module } from '@nestjs/common';
import { TodosModule } from './todos/todos.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Todo } from '@entities/todo.entity';

const isDocker = process.env.NODE_ENV === 'docker';

console.log('Connecting to database with:', {
  host: process.env.POSTGRES_HOST,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
});

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: isDocker ? process.env.POSTGRES_HOST : 'localhost',
      port: isDocker ? Number(process.env.POSTGRES_PORT) : 5433, 
      username: process.env.POSTGRES_USER, // From .env
      password: process.env.POSTGRES_PASSWORD, // From .env
      database: process.env.POSTGRES_DB, // From .env
      entities: [__dirname + '/../entities/*.entity{.ts,.js}'],
      synchronize: false,
    }),
    TodosModule,
  ],
  exports: [TypeOrmModule],
})
export class AppModule {}
