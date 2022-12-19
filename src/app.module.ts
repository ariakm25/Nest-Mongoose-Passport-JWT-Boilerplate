import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { TokenModule } from './modules/token/token.module';
import { RolesModule } from './modules/role/roles.module';
import { BullModule } from '@nestjs/bull';
import { MailerModule } from '@nestjs-modules/mailer';
import { BullBoardModule } from './modules/bullboard/bullboard.module';
import { ArticleModule } from './modules/article/article.module';
import { CategoryModule } from './modules/category/category.module';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import mongooseSlugUpdater from 'mongoose-slug-updater';
import mailConfig from 'src/config/mail.config';
import appConfig from 'src/config/app.config';
import databaseConfig from 'src/config/database.config';
import tokenConfig from 'src/config/token.config';
import redisConfig from 'src/config/redis.config';
import bullboardConfig from './config/bullboard.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [
        appConfig,
        databaseConfig,
        tokenConfig,
        mailConfig,
        redisConfig,
        bullboardConfig,
      ],
      cache: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('database.url'),
        useNewUrlParser: true,
        connectionFactory: (connection) => {
          connection.plugin(mongooseSlugUpdater);
          return connection;
        },
      }),
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        redis: {
          host: configService.get<string>('redis.host'),
          port: configService.get<number>('redis.port'),
        },
      }),
    }),
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 120,
    }),
    BullBoardModule,
    MailerModule,
    UserModule,
    AuthModule,
    TokenModule,
    RolesModule,
    ArticleModule,
    CategoryModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
