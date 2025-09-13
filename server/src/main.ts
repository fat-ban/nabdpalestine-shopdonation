import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { EnvValidationService } from './config/env.validation';

async function bootstrap() {
  // Validate environment variables
  try {
    const config = EnvValidationService.validateEnvironment();
    console.log('✅ Environment validation passed');
    console.log(`📊 Database: ${config.database.host}:${config.database.port}/${config.database.database}`);
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error('❌ Environment validation failed:', msg);
    process.exit(1);
  }

  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe()); // <-- This enables validation globally

  // Enable CORS for development
  app.enableCors({
    origin: process.env.NODE_ENV === 'production' ? false : true,
    credentials: true,
  });

  const port = process.env.PORT || 5000;
  await app.listen(port);
  
  console.log(`🚀 Application is running on: http://localhost:${port}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
}
bootstrap();
