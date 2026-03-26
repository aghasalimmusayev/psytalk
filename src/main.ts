import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser())
  const config = new DocumentBuilder()
    .setTitle('PsyTalk example')
    .setDescription('The PsyTalk API description')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('PsyTalk')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  app.enableCors({
    origin: process.env.CLIENT_URL,
    credentials: true
  })

  await app.listen(process.env.PORT ?? 4014);
}
bootstrap();
