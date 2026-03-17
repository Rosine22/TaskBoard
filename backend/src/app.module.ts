import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { TasksModule } from './tasks/tasks.module';
import { Task } from './tasks/task.entity';
import { existsSync } from 'fs';
import { resolve } from 'path';

const envPaths = [
  resolve(process.cwd(), '.env'),
  resolve(__dirname, '../.env'),
];

for (const envPath of envPaths) {
  if (existsSync(envPath)) {
    (process as any).loadEnvFile?.(envPath);
    break;
  }
}

const dbType = process.env.DATABASE_URL
  ? 'postgres'
  : (process.env.DB_TYPE ?? 'sqljs').toLowerCase();

const databaseOptions: TypeOrmModuleOptions =
  dbType === 'postgres'
    ? {
        type: 'postgres',
        url: process.env.DATABASE_URL,
        host: process.env.DB_HOST || 'localhost',
        port: Number(process.env.DB_PORT) || 5432,
        username: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASS || 'postgres',
        database: process.env.DB_NAME || 'taskboard',
        entities: [Task],
        synchronize: true,
      }
    : {
        type: 'sqljs',
        location: resolve(process.cwd(), process.env.DB_FILE || 'taskboard.sqlite'),
        autoSave: true,
        entities: [Task],
        synchronize: true,
      };

@Module({
  imports: [
    TypeOrmModule.forRoot(databaseOptions),
    TasksModule,
  ],
})
export class AppModule {}
