import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ValidationPipe } from '@nestjs/common';
import * as path from 'path';

// Load apps/.env into process.env using Node's built-in loader (no dotenv
// package needed). Missing file is fine — the defaults below apply.
try {
  process.loadEnvFile(path.join(process.cwd(), 'apps', '.env'));
} catch {
  // no .env file — run with defaults / real environment variables
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({whitelist:true}));
  app.enableCors();
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}/api`);
}

bootstrap();
