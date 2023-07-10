import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
  }),
  );
  const cors = require("cors")
  const corsOptions = {
    origin: '*',
    Credential: true,
    optionSuccessStatus: 200,
  }
  app.use(cors(corsOptions))
  await app.listen(3002);

}
bootstrap();
