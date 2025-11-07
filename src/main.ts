import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ Bật CORS đúng cách
  app.enableCors({
    origin: [
      'http://localhost:5173',        // frontend local Vite
      'https://your-frontend.vercel.app' // nếu có deploy
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  await app.listen(process.env.PORT || 3000);
  console.log(`🚀 Server is running on port ${process.env.PORT || 3000}`);
}
bootstrap();
