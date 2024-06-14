import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ENVIRONMENT } from './utils/globals';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT;
  await app.listen(port);
  console.log(`[${ENVIRONMENT}] RUNNING AT PORT: ${port}`)
}
bootstrap();
