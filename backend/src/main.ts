import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const origin = [
    process.env.FRONTEND_URL || 'http://localhost:5173',
    'https://taskboa.netlify.app/',
  ];
  app.enableCors({ origin });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(` NestJS API running at port ${port}`);
}
bootstrap();