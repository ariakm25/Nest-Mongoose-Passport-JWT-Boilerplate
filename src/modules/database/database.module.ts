import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import mongooseSlugUpdater from 'mongoose-slug-updater';
import { Exists } from 'src/common/decorators/validator/exists';
import { Unique } from 'src/common/decorators/validator/unique';

@Module({
  imports: [
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
  ],
  providers: [Unique, Exists],
  exports: [],
})
export class DatabaseModule {}
