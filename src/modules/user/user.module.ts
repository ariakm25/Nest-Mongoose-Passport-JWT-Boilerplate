import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User, UserSchema } from './entities/user.entity';
import bcrypt from 'bcryptjs';
import { MailModule } from '../mail/mail.module';
import { TokenModule } from '../token/token.module';
import mongoosePaginate from 'mongoose-paginate-v2';

@Module({
  imports: [
    MailModule,
    TokenModule,
    MongooseModule.forFeatureAsync([
      {
        name: User.name,
        useFactory: () => {
          const schema = UserSchema;
          schema.pre('save', function (next) {
            // eslint-disable-next-line @typescript-eslint/no-this-alias
            const user: any = this;
            if (user.password == null) return next();
            if (!user.isModified('password')) return next();

            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(user.password, salt);
            user.password = hash;
            next();
          });

          schema.plugin(mongoosePaginate);

          return schema;
        },
      },
    ]),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
