import { Module } from '@nestjs/common';
import { TodosModule } from './todos/todos.module';

@Module({
  imports: [TodosModule],
  // controllers: [AppController],
  // providers: [AppService],
})
export class AppModule {}
