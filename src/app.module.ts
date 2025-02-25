import { Module } from '@nestjs/common';
import { TodosModule } from './todos/todos.module';
import { Todo } from 'entities/todo.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.NODE_ENV === 'docker' ? process.env.POSTGRES_HOST : 'localhost', // From .env
      port: 5432, 
      username: process.env.POSTGRES_USER, // From .env
      password: process.env.POSTGRES_PASSWORD, // From .env
      database: process.env.POSTGRES_DB, // From .env
      entities: [Todo],
      synchronize: false,
    }),
    TodosModule,
  ],
  // controllers: [AppController],
  // providers: [AppService],
})
export class AppModule {}
