import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Url } from 'url';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors(
    {
    origin: 'http://localhost:4200', // IMPORTANT: Exact match for Angular origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Ensure GET is allowed
    credentials: true, // If Angular is sending cookies/auth headers with 'withCredentials: true'
    allowedHeaders: 'Content-Type, Authorization', // Allow these headers
  }
  )

  const configService = app.get(ConfigService)
  const  port = configService.get<number>("PORT") || 3009
  const baseurl = configService.get<Url>("APP_BASE_URL")
  await app.listen(port);
  console.log(` Server is running on ${baseurl}`)
}
bootstrap();