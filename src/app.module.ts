import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TodoModule } from './modules/todo/todo.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'ms26052003',
      database: 'todoApiDB',
      entities: ['dist/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    TodoModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
