import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { TransformInterceptor } from './interceptors/transform.interceptor';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import compression from 'compression';
import { useContainer } from 'class-validator';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Api Docs')
    .setDescription('The API Documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
    customSiteTitle: 'API Docs',
    customCss:
      '.swagger-container .swagger-ui { max-width: 800px; margin: 0 auto; }',
  });

  app.use(helmet());
  app.use(compression());
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  app.useGlobalInterceptors(new TransformInterceptor());
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  await app.listen(configService.get<string>('PORT'), async () =>
    console.log(`Server running on ${await app.getUrl()}`),
  );
}
bootstrap();
