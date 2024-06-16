import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ENVIRONMENT } from './utils/globals';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT;
  app.enableCors({
    origin: [process.env.APP_URL],
    credentials: true,
  });
  app.use(cookieParser());
  await app.listen(port);
  console.log(`[${ENVIRONMENT}] RUNNING AT PORT: ${port}`);
}
bootstrap();
